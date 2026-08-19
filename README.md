# Bai Tien Len (Tiến Lên) — How to play

A short, friendly guide to playing Bai Tien Len (also called Tiến Lên or "Vietnamese Big Two"). This README describes a commonly used set of rules — there are many regional variations, so check the rules your group uses before playing.

## Overview
- Players: 2–4 (most common: 4 players).
- Deck: Standard 52-card deck (no jokers).
- Objective: Be the first to get rid of all your cards. Play continues to determine full ranking of players.

## Card ranking
- Rank (low to high): 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2.
- 2 is the highest single card.
- When a tie must be broken between same-ranked cards, many groups use a suit order (low → high): Clubs ♣, Diamonds ♦, Hearts ♥, Spades ♠. Some groups use a different suit order — agree with your group.

## Setup
1. Shuffle and deal all cards evenly to players (for 4 players, each gets 13 cards).
2. The player holding the 3♣ (or lowest agreed card) typically leads the first trick — this can vary by local rules.

## Legal plays (combinations)
You can lead one of the following combinations. When players play to the table, later players must play the same type of combination but of a higher rank/strength to beat the current play.
- Single: any one card.
- Pair: two cards of the same rank (e.g., two 7s).
- Three-of-a-kind: three cards of the same rank.
- Straight (sequence): three or more consecutive ranks (example: 4-5-6). In many Tiến Lên rules, straights must be of the same suit; in other variants suits don't matter. Use the group rule.
- Double-sequence (consecutive pairs): two or more consecutive pairs (e.g., 55-66). Some groups allow only length 3+ for straights or 2+ for pair sequences — check your variant.
- Bombs: Four-of-a-kind (tứ quý) and other special multi-card combinations are often considered bombs that can beat certain otherwise unbeatable cards (for example, beat a 2). Bomb rules vary a lot across play groups.

Important: To beat a play, you must play the same combination type (and the same number of cards) with a higher ranked value. Example: a pair of 9s can be beaten by a pair of 10s, but not by a single card or a three-of-a-kind (unless bombs or special rules apply in your variant).

## Turn order and table play
1. The lead player places a legal combination face-up on the table.
2. Going clockwise, each player may either pass or play a higher combination of the same type.
3. If all other players pass, the last player who played a card wins the trick and leads the next trick (can play any legal combination).
4. Play continues until one player has emptied their hand. That player is the winner; remaining players continue to play to determine next positions if you want a full ranking.

## Special rules and common variations (pick one set before you start)
- Bombs vs 2: In many groups, a four-of-a-kind (tứ quý) beats a single 2. Some groups allow only certain bombs or special higher-combo rules.
- Straights suit rule: Some variants require straights to be in the same suit; others do not. Agree before the first hand.
- Passing and lifting: Some rules allow a player who passed to re-enter the current trick if a later player plays a different (higher) play — this is uncommon; decide beforehand.

## Scoring (optional)
- Simple ranking: Players are ranked by the order they go out: 1st, 2nd, 3rd, last.
- Point-based: Remaining cards in hand count as penalty points (e.g., 1 point per card). Some groups weight 2s or special cards with extra penalty points.

## Example quick-play (4 players)
1. Deal 13 cards each. Player A has the 3♣ and leads with the 3♣ (single).
2. Player B plays 5♣ (higher single), Player C passes, Player D plays 7♦ (higher still). Play continues until everyone passes to the highest play.
3. The player who played 7♦ won that trick and starts the next round with any legal combination.
4. When a player runs out of cards, they place them down — play continues until all player positions are decided.

## Tips for beginners
- Rearrange your hand by rank and by suit so you can quickly spot pairs, triples, and possible straights.
- Watch which high cards and 2s have been played to estimate what remaining players can beat.
- Hold bombs to break strong plays (like a 2), but use them to secure a lead when it matters.

## Example: short play-by-play hand
This is a short illustrative 4-player hand to show how turns can play out.

- Player hands (selected key cards only):
  - Player A: 3♣, 7♠, 9♦, 9♣, Q♥, K♣, 2♦
  - Player B: 4♦, 5♦, 6♦, 6♠, 8♥, J♣, A♠
  - Player C: 3♦, 3♥, 5♣, 7♣, 9♠, 10♦, K♠
  - Player D: 4♣, 4♠, 5♥, 8♣, J♦, Q♠, A♥

1. Lead: Player A holds 3♣ and must lead first. Player A leads single 3♣.
2. Player B must beat the single (higher single). Player B plays 4♦.
3. Player C plays 3♦ — cannot beat 4♦, so passes.
4. Player D plays 4♣ — compares to 4♦ by suit (if using suit tiebreaker, Clubs < Diamonds < Hearts < Spades in some groups) — but since 4♣ is lower than 4♦ by our chosen order, it does not beat it. If Player D cannot beat 4♦, they pass.
5. Round ends; Player B wins the trick (played 4♦) and leads next.
6. Player B leads a small straight: 4♦-5♦-6♦ (if your group allows mixed-suit straights, else same-suit straight).
7. Player C doesn't have a 3-card straight to beat it and passes; Player D passes; Player A passes.
8. Player B wins and can lead again. They lead pair 6♠-6♦ (if they had a pair) — play continues until someone empties their hand.

This example demonstrates passing, beating with higher singles, and the winner of a trick leading the next round.

## Machine-readable rules (rules.json)
A simple rules.json is included in this repository so web apps or bots can implement the same basic rule set. It lists rank order, combination types, suit order, and basic bomb rules. See rules.json for the exact structure used.

## Included files
- README.md — this file (English)
- README.vi.md — Vietnamese translation
- rules.json — machine-readable rule set used by the sample CLI
- cli.py — small Python CLI to validate plays and simulate a quick trick winner

## Variants and further reading
Because Tiến Lên has many local rule sets (Southern Tiến Lên, Northern variations, Big Two-style rules), this README gives a practical, common rule set but not an exhaustive rule book. If you'd like the README and rules.json tweaked for a particular local variant, tell me which one (Southern / Northern / Big Two) and I'll update all files accordingly.

Enjoy playing! If you'd like any of the example files (rules.json, cli.py) adjusted — for example to enforce same-suit straights or different bomb rules — I can update them to match your house rules.