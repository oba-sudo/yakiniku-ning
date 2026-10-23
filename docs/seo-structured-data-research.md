# 構造化データ実装判断（2026-10-23確認）

店舗別ページには、各実店舗を最も具体的な `Restaurant` としてJSON-LDで記述する。Googleは複数店舗の場合も各物理拠点を個別のLocalBusinessとして定義し、最も具体的なサブタイプを使うよう案内している。各ページには、見えている店舗名・住所・電話番号・営業時間・料理ジャンル・価格帯・メニューURL・店舗別URLだけを入れる。座標は正確な緯度経度が未提供のため出力しない。自己サイトが収集していない第三者レビューの評価・件数も、Googleの推奨に従い `aggregateRating` / `review` に入れない。

JSON-LDを採用する。GoogleはJSON-LDを実装・保守しやすい形式として推奨し、構造化データは対象ページのユーザーに見える内容を記述するよう求めている。店舗詳細では `BreadcrumbList` も出力する。

Q&Aは、ユーザーが読めるFAQコンテンツとして実装する。Googleは2026年6月15日にFAQリッチリザルトの文書を削除し、同リッチリザルトがGoogle検索に表示されなくなったと公表している。そのため、FAQPageマークアップでリッチリザルトを狙う実装はしない。QAPageも、ユーザーが回答を投稿できる単一質問ページだけが対象であり、店舗が作成する複数質問のFAQには不適切である。

## 一次情報

- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/qapage
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
