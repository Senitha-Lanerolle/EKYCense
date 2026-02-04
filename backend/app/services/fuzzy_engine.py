# backend/app/services/fuzzy_engine.py
from __future__ import annotations

import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


def build_fuzzy_system() -> ctrl.ControlSystemSimulation:
    """
    Inputs:
      lexical  in [0,1]
      semantic in [0,1]
    Output:
      decision_score in [0,1]
    """

    lexical = ctrl.Antecedent(np.linspace(0, 1, 101), "lexical")
    semantic = ctrl.Antecedent(np.linspace(0, 1, 101), "semantic")
    decision = ctrl.Consequent(np.linspace(0, 1, 101), "decision")

    # Memberships (make them simple & explainable)
    lexical["poor"] = fuzz.trimf(lexical.universe, [0.0, 0.0, 0.55])
    lexical["ok"] = fuzz.trimf(lexical.universe, [0.35, 0.60, 0.80])
    lexical["strong"] = fuzz.trimf(lexical.universe, [0.70, 1.0, 1.0])

    semantic["far"] = fuzz.trimf(semantic.universe, [0.0, 0.0, 0.55])
    semantic["close"] = fuzz.trimf(semantic.universe, [0.40, 0.70, 0.88])
    semantic["very_close"] = fuzz.trimf(semantic.universe, [0.78, 1.0, 1.0])

    decision["no_match"] = fuzz.trimf(decision.universe, [0.0, 0.0, 0.40])
    decision["partial"] = fuzz.trimf(decision.universe, [0.25, 0.50, 0.75])
    decision["match"] = fuzz.trimf(decision.universe, [0.60, 1.0, 1.0])

    rules = [
        # Clear match when both are strong
        ctrl.Rule(lexical["strong"] & semantic["very_close"], decision["match"]),
        ctrl.Rule(lexical["strong"] & semantic["close"], decision["match"]),
        ctrl.Rule(lexical["ok"] & semantic["very_close"], decision["match"]),

        # Partial when one is strong and the other is uncertain
        ctrl.Rule(lexical["ok"] & semantic["close"], decision["partial"]),
        ctrl.Rule(lexical["poor"] & semantic["very_close"], decision["partial"]),
        ctrl.Rule(lexical["strong"] & semantic["far"], decision["partial"]), 

        # No match when both are weak
        ctrl.Rule(lexical["poor"] & semantic["far"], decision["no_match"]),
        ctrl.Rule(lexical["poor"] & semantic["close"], decision["no_match"]),
        ctrl.Rule(lexical["ok"] & semantic["far"], decision["no_match"]),
    ]

    system = ctrl.ControlSystem(rules)
    return ctrl.ControlSystemSimulation(system)


def fuzzy_score_and_decision(
    lexical_sim: float,
    semantic_sim: float,
    match_threshold: float = 0.80,
    partial_threshold: float = 0.45
) -> tuple[float, str]:
    """
    Returns:
      fuzzy_score in [0,1]
      decision: MATCH / PARTIAL_MATCH / NO_MATCH
    """
    sim = build_fuzzy_system()
    sim.input["lexical"] = float(np.clip(lexical_sim, 0.0, 1.0))
    sim.input["semantic"] = float(np.clip(semantic_sim, 0.0, 1.0))
    sim.compute()

    score = float(sim.output["decision"])

    if score >= match_threshold:
        return score, "MATCH"
    if score >= partial_threshold:
        return score, "PARTIAL_MATCH"
    return score, "NO_MATCH"