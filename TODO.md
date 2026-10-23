# YAKINIKUEN 忍鬨｜実装ToDo

- [x] 全店舗一覧ページを作成し、8店舗（東心斎橋総本店、東心斎橋2号店、日本橋店、堺筋本町店、野田店、富田林店、大阪梅田店、梅田東通り店）へ固有URLで案内する。
- [x] 各店舗ページで、提供Excelを根拠に住所、電話番号、営業時間、定休日、アクセス、Googleマップ、電話予約導線を表示する。
- [x] 各店舗ページで、提供Excelの店舗別メニューと価格を表示し、資料未提供の店舗は誤ったメニューを補わず「準備中」と明示する。
- [x] 各店舗ページに、公式Instagram、LINE表示領域、最新情報の表示領域を設ける。LINEの正式URLは未提供のため、確定後に設定値を差し替える。
- [x] 忍鬨全体のQ&Aページと、各店舗の基本情報に即した店舗別Q&Aを実装する。
- [x] 各公開URLに固有のtitle、meta description、OGPを実装する。実ドメイン設定時にcanonicalも生成する。HTML本文はJavaScript実行前から取得可能にする。
- [x] 各店舗にRestaurant構造化データ、各詳細ページにBreadcrumbListを実装する。提供元が未確認の口コミ・評価は自己掲載の構造化データへ流用しない。
- [x] robots.txt、sitemap.xml、manus-routes.jsonを生成する。実公開ドメイン未設定時は、誤った絶対URLを出力しない。
- [x] 正式ロゴ、料理写真、店舗外観、店内動画を使い、既存の焼肉ライク型デザインを継承する。
- [ ] 実公開ドメインを `SITE_URL` に設定して再ビルドし、canonical、OGP URL、Restaurant JSON-LDのURL、sitemap.xmlを本番URLで生成する。
- [ ] 共通または店舗別のLINE公式URLを設定する。
- [ ] 公開後は403を最優先で確認し、次にsitemap、canonical、店舗別SEOタグ、構造化データ、Search Consoleの公開URLテストを確認する。
