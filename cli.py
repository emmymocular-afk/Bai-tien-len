"""
cli.py — Small Python CLI to validate plays and simulate a quick trick for Bai Tiến Lên (Southern rules)

This script provides:
- Basic card parsing (e.g., '3C', '10H', 'AS', '2D')
- Detection of combination types: single, pair, triple, straight (3+), pair_sequence (2+ pairs), four_of_a_kind
- Simple comparison logic to see if one play beats another following rules.json
- A small demo 'simulate_trick' that shows a few sample plays

This is intentionally concise and not a full game engine. Use it as reference code for validating hands and comparing plays.
"""
import json
import os
from collections import Counter

HERE = os.path.dirname(__file__)
RULES_PATH = os.path.join(HERE, 'rules.json')

with open(RULES_PATH, 'r', encoding='utf-8') as f:
    RULES = json.load(f)

RANKS = RULES['ranks']
SUITS = RULES['suits']
SUIT_ORDER = RULES['suit_order']
RANK_INDEX = {r: i for i, r in enumerate(RANKS)}


def parse_card(card):
    """Parse a card string like '3C', '10H', 'AS', '2D' -> (rank, suit)"""
    card = card.strip().upper()
    if len(card) < 2:
        raise ValueError('Invalid card: %r' % card)
    suit = card[-1]
    rank = card[:-1]
    if rank not in RANK_INDEX or suit not in SUIT_ORDER:
        raise ValueError('Unknown card: %r' % card)
    return rank, suit


def card_value(card):
    """Numeric value for comparisons: (rank_index, suit_order)"""
    rank, suit = parse_card(card)
    return RANK_INDEX[rank], SUIT_ORDER[suit]


def is_consecutive(sorted_rank_indices):
    """Check if sorted rank indices form a consecutive sequence (no wrap-around)."""
    return all(b == a + 1 for a, b in zip(sorted_rank_indices, sorted_rank_indices[1:]))


def detect_combination(cards):
    """Detect combination type and a primary comparison key.

    Returns (combination_type, primary_rank_index, tiebreak_info)
    tiebreak_info may contain extra info such as suit high card index for singles.
    Returns (None, None, None) if not a recognized combination.
    """
    if not cards:
        return None, None, None
    parsed = [parse_card(c) for c in cards]
    ranks = [p[0] for p in parsed]
    suits = [p[1] for p in parsed]
    counts = Counter(ranks)
    unique_ranks = list(counts.keys())
    length = len(cards)

    # Single
    if length == 1:
        r_idx = RANK_INDEX[ranks[0]]
        s_order = SUIT_ORDER[suits[0]]
        return 'single', r_idx, {'suit_order': s_order}

    # Pair
    if length == 2 and len(unique_ranks) == 1:
        r_idx = RANK_INDEX[unique_ranks[0]]
        return 'pair', r_idx, None

    # Triple
    if length == 3 and len(unique_ranks) == 1:
        r_idx = RANK_INDEX[unique_ranks[0]]
        return 'triple', r_idx, None

    # Four of a kind (bomb)
    if length == 4 and len(unique_ranks) == 1:
        r_idx = RANK_INDEX[unique_ranks[0]]
        return 'four_of_a_kind', r_idx, None

    # Straight: mixed-suit or same-suit depending on rules
    if length >= RULES.get('straight_min_length', 3):
        # Get rank indices and ensure all ranks different
        if len(set(ranks)) == length:
            indices = sorted(RANK_INDEX[r] for r in ranks)
            if is_consecutive(indices):
                if RULES.get('require_same_suit_for_straight'):
                    if len(set(suits)) == 1:
                        return 'straight', indices[-1], None
                else:
                    return 'straight', indices[-1], None

    # Pair-sequence (consecutive pairs)
    if length >= RULES.get('pair_sequence_min_pairs', 2) * 2 and length % 2 == 0:
        # group into pairs
        if all(cnt == 2 for cnt in counts.values()):
            # check consecutive ranks
            indices = sorted(RANK_INDEX[r] for r in counts.keys())
            if is_consecutive(indices):
                return 'pair_sequence', indices[-1], {'pairs': len(indices)}

    return None, None, None


def beats(play, current):
    """Return True if play (list of card strings) beats current (list of card strings) per RULES."""
    # None or empty current -> any legal play wins
    if not play:
        return False
    p_type, p_rank, p_info = detect_combination(play)
    if p_type is None:
        return False
    if not current:
        return True
    c_type, c_rank, c_info = detect_combination(current)
    if c_type is None:
        return True

    # Same type: compare primary rank (higher rank wins)
    if p_type == c_type:
        if p_rank != c_rank:
            return p_rank > c_rank
        # Tie: for singles, check suit
        if p_type == 'single':
            return p_info['suit_order'] > c_info['suit_order']
        # For pair_sequence or straight, length matters (must be same length to compare)
        if p_type in ('straight', 'pair_sequence'):
            if len(play) != len(current):
                return False
            return p_rank > c_rank
        return False

    # Bombs: four_of_a_kind beats single 2 if configured
    bombs = RULES.get('bombs', {})
    if p_type == 'four_of_a_kind' and c_type == 'single':
        # If current is single 2 and bomb can beat 2
        c_rank_name, _ = parse_card(current[0])
        if c_rank_name == '2' and bombs.get('four_of_a_kind', {}).get('can_beat_2'):
            return True
    # Bomb vs bomb: higher rank wins
    if p_type == 'four_of_a_kind' and c_type == 'four_of_a_kind':
        return p_rank > c_rank

    # Otherwise play doesn't beat current (different type)
    return False


def simulate_trick():
    """Simple demonstration of validation and comparison."""
    print('Rules variant:', RULES.get('variant'))
    print('Example: compare single plays')
    a = ['3C']
    b = ['4D']
    c = ['2D']
    print('Play A:', a, 'Play B:', b, 'Play C:', c)
    print('Does B beat A?', beats(b, a))
    print('Does C beat B?', beats(c, b))

    print('\nExample: four-of-a-kind bomb beating a single 2')
    bomb = ['9C', '9D', '9H', '9S']
    two = ['2D']
    print('Bomb:', bomb, 'Two:', two)
    print('Bomb beats two?', beats(bomb, two))

    print('\nExample: straights')
    s1 = ['4C', '5D', '6H']
    s2 = ['5C', '6D', '7H']
    print('Straight1:', s1, 'Straight2:', s2)
    print('s2 beats s1?', beats(s2, s1))

    print('\nExample: invalid plays')
    invalid = ['4C', '4D', '5H']
    t, _, _ = detect_combination(invalid)
    print(invalid, 'detected as', t)


if __name__ == '__main__':
    simulate_trick()
