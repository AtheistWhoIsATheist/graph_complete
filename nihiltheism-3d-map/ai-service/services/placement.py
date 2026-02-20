"""
3D node placement service using physics-based optimization.
Positions new nodes in 3D space to minimize overlap and maximize visual clarity.
"""

import numpy as np
from typing import List, Tuple, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlacementCalculator:
    """
    Calculates optimal 3D positions for new nodes using gradient descent.
    """

    def __init__(
        self,
        repulsion_force: float = 1000.0,
        attraction_force: float = 0.1,
        min_distance: float = 3.0
    ):
        self.repulsion_force = repulsion_force
        self.attraction_force = attraction_force
        self.min_distance = min_distance

    def calculate_position(
        self,
        new_category: str,
        existing_positions: List[Tuple[float, float, float]],
        existing_categories: List[str],
        learning_rate: float = 0.05,
        max_iterations: int = 100
    ) -> Tuple[float, float, float]:
        """
        Calculate optimal position using gradient descent.
        """
        # Initialize at random position
        position = np.array([
            np.random.uniform(-10, 10),
            np.random.uniform(-10, 10),
            np.random.uniform(-10, 10)
        ])

        existing_positions_array = np.array(existing_positions)

        for iteration in range(max_iterations):
            force = np.zeros(3)

            # Repulsion from all nodes
            for i, existing_pos in enumerate(existing_positions_array):
                diff = position - existing_pos
                distance = np.linalg.norm(diff)

                if distance < 0.1:
                    distance = 0.1

                repulsion = (self.repulsion_force / (distance ** 2)) * (diff / distance)
                force += repulsion

                # Attraction to same category
                if existing_categories[i] == new_category:
                    attraction = -self.attraction_force * diff
                    force += attraction

            # Update position
            position += learning_rate * force

            # Ensure minimum distance from all nodes
            for existing_pos in existing_positions_array:
                distance = np.linalg.norm(position - existing_pos)
                if distance < self.min_distance:
                    diff = position - existing_pos
                    position = existing_pos + (diff / distance) * self.min_distance

        return (float(position[0]), float(position[1]), float(position[2]))