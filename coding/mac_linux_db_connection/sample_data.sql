-- data_schema で接続して実行（Pagesの所有者）
-- Phase 1（フラット一覧）・Phase 2（parent_idによるネスト表示）で共通して使えるよう、
-- あえて親子関係を持ったサンプルデータにしている

-- ルートページ
INSERT INTO Pages (title, content, parent_id) VALUES ('Getting Started', 'Notion風メモアプリのサンプルページです。', NULL);
INSERT INTO Pages (title, content, parent_id) VALUES ('Projects', 'プロジェクト一覧のトップページ', NULL);
INSERT INTO Pages (title, content, parent_id) VALUES ('Notes', '雑多なメモ置き場', NULL);

-- 子ページ（Projects配下）
INSERT INTO Pages (title, content, parent_id)
  VALUES ('Project A', 'プロジェクトAの概要', (SELECT id FROM Pages WHERE title = 'Projects'));
INSERT INTO Pages (title, content, parent_id)
  VALUES ('Project B', 'プロジェクトBの概要', (SELECT id FROM Pages WHERE title = 'Projects'));

-- 孫ページ（Project A配下）
INSERT INTO Pages (title, content, parent_id)
  VALUES ('Project A - Meeting Notes', 'プロジェクトAの会議メモ', (SELECT id FROM Pages WHERE title = 'Project A'));

COMMIT;

-- 確認用
-- SELECT id, title, parent_id FROM Pages ORDER BY id;
