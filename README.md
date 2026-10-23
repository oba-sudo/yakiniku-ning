# YAKINIKUEN 忍鬨｜店舗SEOサイト

提供された店舗一覧Excelを正本に、忍鬨8店舗の店舗情報・メニュー・Q&Aを静的HTMLとして出力するサイトです。検索クローラーがJavaScriptを実行しなくても、各店舗の本文、title、description、Restaurant JSON-LD、BreadcrumbListを読める構成です。

## ローカル確認

```bash
npm run build
npm run dev
```

`http://localhost:3000/` で確認できます。`/stores/` は店舗一覧、`/stores/{slug}/` は店舗個別ページ、`/faq/` は全体Q&Aです。

## 店舗・メニュー情報の更新

新しいExcelを受け取った場合は、次のコマンドで店舗・メニューJSONを更新してからビルドします。

```bash
python3 scripts/import-stores.py /absolute/path/to/stores.xlsx
npm run build
```

メニュー資料が未提供の店舗は、誤ったメニューを出さずに「準備中」と表示します。

## キャンペーン・お知らせとCMS

現段階ではWordPress・Bricksが未契約のため、トップ上部のキャンペーン・最新情報は `src/data/content.json` の暫定投稿データを表示しています。WordPress + Bricksの契約・開設後は、キャンペーンとお知らせをカスタム投稿タイプとして管理し、BricksのQuery Loopへ置き換えます。店舗用投稿タイプ、固定URL、JSON-LD、移行時の301リダイレクトを含む実装仕様は `docs/bricks-cms-handover.md` を参照してください。

## 本番SEO設定

公開前に、実際のHTTPSドメインを `SITE_URL` として設定してください。これにより、各ページのcanonical、OGP URL、Restaurant JSON-LDのURL／menu／image、sitemap.xml、robots.txtのSitemap行が本番URLで生成されます。

```bash
SITE_URL=https://www.your-domain.example npm run build
```

実ドメインがない状態では、誤ったcanonicalや偽のsitemap URLを生成しない安全な出力になります。

## SNS・LINE

Instagramはブランド共通の公式アカウントを設定済みです。LINEの公式URLは提供資料に含まれていないため、店舗ページでは公開準備中と表示します。正式な共通URLまたは店舗別URLが確定したら、`scripts/build.mjs` 内の `brand.line` を更新してください。

## 素材の配信

ロゴ、料理写真、店舗外観、店内動画はManusプロジェクトストレージの `/manus-storage/` パスを使っています。ManusのPreviewで画像・動画が表示できることを確認済みです。別の静的ホストへ移管する場合は、素材をそのホストの公開ディレクトリへコピーするか、同等の恒久HTTPS URLへ差し替えてください。

## 公開後の優先確認

1. 公開URLが403にならず、トップ・店舗詳細・sitemap.xml・robots.txtがHTTP 200で取得できること。
2. ホスティング側の公開設定、WAF、Bot対策、アクセス制限、海外IP制限を確認すること。
3. Google Search Consoleの公開URLテストで「ページの取得：成功」となること。
4. canonical、sitemap、各店舗のtitle／description／OGP、Restaurant JSON-LDを確認すること。
5. Rich Results Testで店舗詳細の構造化データを確認すること。

FAQは読者向けコンテンツとして実装しています。Google検索では2026年6月にFAQリッチリザルトが終了したため、FAQPageマークアップでの表示拡張を目的にしていません。
