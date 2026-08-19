# Bai Tien Len (Tiến Lên) — How to play / Hướng dẫn chơi

This README contains both English and Vietnamese translations so readers can choose the language they prefer.

---

## English (How to play)

A short, friendly guide to playing Bai Tien Len (also called Tiến Lên or "Vietnamese Big Two"). This README describes a commonly used set of rules — there are many regional variations, so check the rules your group uses before playing.

### Overview
- Players: 2–4 (most common: 4 players).
- Deck: Standard 52-card deck (no jokers).
- Objective: Be the first to get rid of all your cards. Play continues to determine full ranking of players.

### Card ranking
- Rank (low to high): 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2.
- 2 is the highest single card.
- When a tie must be broken between same-ranked cards, many groups use a suit order (low → high): Clubs ♣, Diamonds ♦, Hearts ♥, Spades ♠. Some groups use a different suit order — agree with your group.

### Setup
1. Shuffle and deal all cards evenly to players (for 4 players, each gets 13 cards).
2. The player holding the 3♣ (or lowest agreed card) typically leads the first trick — this can vary by local rules.

### Legal plays (combinations)
You can lead one of the following combinations. When players play to the table, later players must play the same type of combination but of a higher rank/strength to beat the current play.
- Single: any one card.
- Pair: two cards of the same rank (e.g., two 7s).
- Three-of-a-kind: three cards of the same rank.
- Straight (sequence): three or more consecutive ranks (example: 4-5-6). In many Tiến Lên rules, straights must be of the same suit; in other variants suits don't matter. Use the group rule.
- Double-sequence (consecutive pairs): two or more consecutive pairs (e.g., 55-66). Some groups allow only length 3+ for straights or 2+ for pair sequences — check your variant.
- Bombs: Four-of-a-kind (tứ quý) and other special multi-card combinations are often considered bombs that can beat certain otherwise unbeatable cards (for example, beat a 2). Bomb rules vary a lot across play groups.

Important: To beat a play, you must play the same combination type (and the same number of cards) with a higher ranked value. Example: a pair of 9s can be beaten by a pair of 10s, but not by a single card or a three-of-a-kind (unless bombs or special rules apply in your variant).

### Turn order and table play
1. The lead player places a legal combination face-up on the table.
2. Going clockwise, each player may either pass or play a higher combination of the same type.
3. If all other players pass, the last player who played a card wins the trick and leads the next trick (can play any legal combination).
4. Play continues until one player has emptied their hand. That player is the winner; remaining players continue to play to determine next positions if you want a full ranking.

### Special rules and common variations (pick one set before you start)
- Bombs vs 2: In many groups, a four-of-a-kind (tứ quý) beats a single 2. Some groups allow only certain bombs or special higher-combo rules.
- Straights suit rule: Some variants require straights to be in the same suit; others do not. Agree before the first hand.
- Passing and lifting: Some rules allow a player who passed to re-enter the current trick if a later player plays a different (higher) play — this is uncommon; decide beforehand.

### Scoring (optional)
- Simple ranking: Players are ranked by the order they go out: 1st, 2nd, 3rd, last.
- Point-based: Remaining cards in hand count as penalty points (e.g., 1 point per card). Some groups weight 2s or special cards with extra penalty points.

### Example quick-play (4 players)
1. Deal 13 cards each. Player A has the 3♣ and leads with the 3♣ (single).
2. Player B plays 5♣ (higher single), Player C passes, Player D plays 7♦ (higher still). Play continues until everyone passes to the highest play.
3. The player who played 7♦ won that trick and starts the next round with any legal combination.
4. When a player runs out of cards, they place them down — play continues until all player positions are decided.

### Tips for beginners
- Rearrange your hand by rank and by suit so you can quickly spot pairs, triples, and possible straights.
- Watch which high cards and 2s have been played to estimate what remaining players can beat.
- Hold bombs to break strong plays (like a 2), but use them to secure a lead when it matters.

### Example: short play-by-play hand
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

### Machine-readable rules (rules.json)
A simple rules.json is included in this repository so web apps or bots can implement the same basic rule set. It lists rank order, combination types, suit order, and basic bomb rules. See rules.json for the exact structure used.

### Included files
- README.md — this bilingual file (English + Vietnamese)
- README.vi.md — Vietnamese translation (same content)
- rules.json — machine-readable rule set used by the sample CLI
- cli.py — small Python CLI to validate plays and simulate a quick trick winner

### Variants and further reading
Because Tiến Lên has many local rule sets (Southern Tiến Lên, Northern variations, Big Two-style rules), this README gives a practical, common rule set but not an exhaustive rule book. If you'd like the README and rules.json tweaked for a particular local variant, tell me which one (Southern / Northern / Big Two) and I'll update all files accordingly.

Enjoy playing! If you'd like any of the example files (rules.json, cli.py) adjusted — for example to enforce same-suit straights or different bomb rules — I can update them to match your house rules.

---

## Tiếng Việt (Hướng dẫn chơi)

Hướng dẫn ngắn gọn, thân thiện để chơi Bai Tiến Lên (còn gọi là Tiến Lên hoặc “Vietnamese Big Two”). README này mô tả bộ quy tắc phổ biến; có nhiều biến thể địa phương khác nhau, vì vậy hãy thống nhất luật với nhóm trước khi chơi.

### Tổng quan
- Người chơi: 2–4 (thường gặp: 4 người).
- Bộ bài: Bộ 52 lá tiêu chuẩn (không có joker).
- Mục tiêu: Là người đầu tiên đánh hết bài. Trò chơi thường tiếp tục để xác định thứ hạng đầy đủ của các người chơi.

### Thứ tự lá bài
- Thứ tự (từ thấp đến cao): 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2.
- Lá 2 là lá cao nhất khi xét đơn.
- Khi cần so sánh giữa các lá cùng thứ hạng, nhiều nhóm dùng thứ tự chất (từ thấp → cao): Tép ♣, Rô ♦, Cơ ♥, Bích ♠. Một số nhóm dùng thứ tự khác — hãy thỏa thuận trước.

### Chuẩn bị
1. Trộn và chia hết bài cho các người chơi (với 4 người, mỗi người 13 lá).
2. Người giữ 3♣ (hoặc lá thấp nhất đã thỏa thuận) thường được đánh lượt đầu — điều này có thể khác nhau theo luật địa phương.

### Các nước đánh hợp lệ (tổ hợp)
Khi ra bài, người đánh đầu có thể đánh một trong các tổ hợp sau. Những người sau phải đánh cùng loại tổ hợp nhưng có giá trị cao hơn để chặn nước hiện tại.
- Đơn: một lá bất kỳ.
- Đôi: hai lá cùng giá (ví dụ: hai 7).
- Ba lá: ba lá cùng giá.
- Sảnh (chuỗi): ba lá trở lên liên tiếp (ví dụ: 4-5-6). Ở nhiều luật Tiến Lên, sảnh phải cùng chất; ở biến thể khác thì không. Hãy chọn theo nhóm.
- Đôi liên tiếp (dãy đôi): hai cặp liên tiếp trở lên (ví dụ: 55-66). Một số nhóm chỉ cho phép độ dài tối thiểu khác nhau — kiểm tra biến thể của bạn.
- Bombs (tứ quý): Bốn lá cùng giá (tứ quý) và một số tổ hợp đặc biệt được xem là bomb, có thể chặn những quân thông thường mạnh (ví dụ: chặn 2). Luật bomb rất đa dạng.

Lưu ý quan trọng: Để chặn một nước, bạn phải đánh cùng loại tổ hợp với số lá bằng nhau và có giá trị cao hơn. Ví dụ: đôi 9 có thể bị chặn bởi đôi 10, nhưng không thể bị chặn bởi một lá đơn hay ba lá (trừ khi có bomb hoặc luật đặc biệt).

### Thứ tự lượt và cách chơi
1. Người dẫn đầu đặt tổ hợp hợp lệ úp lên bàn.
2. Theo chiều kim đồng hồ, mỗi người có thể bỏ lượt (pass) hoặc đánh một tổ hợp cùng loại nhưng mạnh hơn.
3. Nếu tất cả người khác đều bỏ lượt, người đánh cuối cùng thắng ván đó và được dẫn tiếp (có thể đánh bất kỳ tổ hợp hợp lệ nào).
4. Trò chơi tiếp tục cho đến khi một người hết bài — người đó về nhất; các người còn lại có thể tiếp tục để xác định thứ hạng tiếp theo nếu muốn.

### Luật đặc biệt và các biến thể phổ biến (chọn 1 bộ luật trước khi chơi)
- Bomb chặn 2: Trong nhiều nhóm, tứ quý (tứ quý) chặn được lá 2 đơn. Một số nhóm chỉ cho phép loại bomb nhất định hoặc luật khác biệt.
- Sảnh cùng chất: Một số biến thể yêu cầu sảnh phải cùng chất; biến thể khác thì không. Hãy đồng ý trước khi chơi.
- Re-enter sau khi pass: Một số luật cho phép người đã pass trước đó được vào lại ván nếu có người chơi sau đó ra nước khác — điều này ít phổ biến; cần thống nhất.

### Tính điểm (tùy chọn)
- Xếp hạng đơn giản: Các người chơi được xếp thứ tự theo thứ tự hết bài: 1, 2, 3, cuối cùng.
- Điểm: Số lá còn trong tay tính là điểm phạt (ví dụ: 1 điểm mỗi lá). Một số nhóm tính điểm nặng hơn cho các lá 2 hoặc tổ hợp đặc biệt.

### Ví dụ chơi nhanh (4 người)
1. Chia 13 lá mỗi người. Người A có 3♣ và đi 3♣ (đơn).
2. Người B đánh 5♣ (đơn mạnh hơn), Người C bỏ, Người D đánh 7♦ (mạnh hơn). Ván tiếp tục cho đến khi mọi người bỏ về nước mạnh nhất.
3. Người đánh 7♦ thắng ván và dẫn lượt tiếp theo.
4. Khi một người đánh hết bài, họ đặt bài xuống — trò chơi có thể tiếp tục để xác định thứ hạng.

### Mẹo cho người mới
- Sắp xếp bài theo giá và chất để dễ nhận ra đôi, ba, sảnh.
- Quan sát các lá mạnh và các lá 2 đã được đánh để ước lượng khả năng chặn của đối thủ.
- Giữ bomb để phá các nước mạnh nếu cần, nhưng dùng chúng đúng lúc để giành lợi thế.

### Ví dụ minh hoạ từng bước (play-by-play)
Dưới đây là ví dụ minh họa với 4 người để cho thấy cách các lượt có thể diễn ra.

- Tay (chỉ liệt kê các lá quan trọng):
  - Người A: 3♣, 7♠, 9♦, 9♣, Q♥, K♣, 2♦
  - Người B: 4♦, 5♦, 6♦, 6♠, 8♥, J♣, A♠
  - Người C: 3♦, 3♥, 5♣, 7♣, 9♠, 10♦, K♠
  - Người D: 4♣, 4♠, 5♥, 8♣, J♦, Q♠, A♥

1. Mở đầu: Người A có 3♣ và đánh 3♣ (đơn).
2. Người B cần chặn bằng một lá đơn lớn hơn, họ đánh 4♦.
3. Người C đánh 3♦ — không chặn được 4♦ nên bỏ lượt.
4. Người D đánh 4♣ — theo thứ tự chất đã chọn, 4♣ thấp hơn 4♦ nên không chặn được (nếu dùng thứ tự chất khác thì kết quả có thể khác). Nếu D không chặn được, họ bỏ lượt.
5. Kết thúc ván; Người B thắng ván (đã đánh 4♦) và dẫn lượt tiếp theo.
6. Người B có thể đánh sảnh nhỏ: 4♦-5♦-6♦ (nếu luật cho phép sảnh khác chất thì hợp lệ).
7. Người C, D, A không có sảnh 3 lá để chặn và bỏ lượt.
8. Người B thắng tiếp và dẫn lần nữa. Trò chơi tiếp tục cho tới khi ai đó hết bài.

Ví dụ này nhằm minh hoạ cơ bản các khái niệm: bỏ lượt, chặn bằng lá lớn hơn, và người thắng ván dẫn lượt tiếp theo.

### rules.json (máy đọc được)
Một file rules.json đơn giản được thêm vào kho để các ứng dụng web hoặc bot có thể sử dụng cùng bộ luật cơ bản này. File liệt kê thứ tự, các loại tổ hợp, thứ tự chất và luật bomb cơ bản. Xem rules.json để biết cấu trúc chi tiết.

### Các file kèm theo
- README.md — file song ngữ này (Tiếng Anh + Tiếng Việt)
- README.vi.md — bản dịch tiếng Việt (nội dung trùng nhau)
- rules.json — cấu hình luật theo định dạng máy (dùng cho CLI)
- cli.py — script Python nhỏ để kiểm tra nước bài và mô phỏng vài ví dụ

### Biến thể và tham khảo thêm
Tiến Lên có nhiều biến thể (Tiến Lên miền Nam, miền Bắc, hoặc luật kiểu Big Two quốc tế). README này trình bày tập luật chung của miền Nam để dễ tiếp cận — nếu bạn muốn, tôi có thể điều chỉnh README và rules.json theo một biến thể cụ thể.

Chúc bạn chơi vui! Nếu muốn tôi có thể cập nhật file dịch, thêm ví dụ chi tiết hơn, hoặc viết phiên bản tương tác cho cli.py.
