#!/bin/bash
# Linux PC側：Oracle Database Free をDockerで起動
# 注意：環境変数名は ORACLE_PWD ではなく ORACLE_PASSWORD（初回はここで起動失敗した）
docker run -d \
  --name oracle-free \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=YourStrongPassword \
  -v oracle-data:/opt/oracle/oradata \
  gvenzl/oracle-free:latest

# ログで "DATABASE IS READY TO USE!" が出るまで待つ
docker logs -f oracle-free

# 動作確認（Mac側から。同一端末上のDBならlocalhost、別端末ならLAN内IPを指定）
# sqlplus system/YourStrongPassword@//192.168.3.11:1521/FREEPDB1
