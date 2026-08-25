-- Mac側SQL DeveloperからLAN経由でLinux側Oracleに接続して実行
-- 接続情報は connection_info.md 参照

-- ============================================
-- Step 1: data_schema / app_schema ユーザー作成
-- ============================================
CREATE USER data_schema IDENTIFIED BY YourStrongPassword1
  DEFAULT TABLESPACE users
  QUOTA UNLIMITED ON users;
GRANT CONNECT, RESOURCE TO data_schema;

CREATE USER app_schema IDENTIFIED BY YourStrongPassword2
  DEFAULT TABLESPACE users
  QUOTA UNLIMITED ON users;
GRANT CONNECT, RESOURCE TO app_schema;

-- ============================================
-- Step 2: data_schema で接続し直し、Pagesテーブルを作成
-- 注意：SYSTEM等の別ユーザーで接続したままここを実行すると
-- 接続ユーザー＝スキーマのOracle仕様により、意図しないスキーマにテーブルができる
-- ============================================
CREATE TABLE Pages (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR2(255) NOT NULL,
  content CLOB,
  parent_id NUMBER,
  CONSTRAINT fk_pages_parent FOREIGN KEY (parent_id) REFERENCES Pages(id)
);

-- ============================================
-- Step 3: data_schema → app_schema へGRANT、app_schema側でシノニム作成
-- ============================================
-- data_schema側
GRANT SELECT, INSERT, UPDATE, DELETE ON Pages TO app_schema;

-- app_schema側（ここは app_schema で接続し直して実行）
CREATE SYNONYM Pages FOR data_schema.Pages;

-- ============================================
-- Step 4: 疎通確認（app_schemaで接続したまま）
-- ============================================
SELECT * FROM Pages;
