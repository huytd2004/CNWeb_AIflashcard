1. Xem cấu hình trong nginx: nginx -T
2. Designed for performance scale

- apt-get update && apt-get install procps
- ps -ef --forest | grep nginx

3. Cài docker cho VPS

- Tài liệu tham khảo: https://docs.docker.com/engine/install/ubuntu/

```bash
# Add Docker's official GPG key
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

- Kiểm tra docker đã chạy chưa:
  - sudo systemctl status docker
  - Khởi chạy nếu chưa:
    - sudo systemctl enable docker
    - sudo systemctl start docker
- Kiểm tra version của docker:
  - docker --version
  - docker compose version

4. Cấu hình các cổng cho VPS

- Cho phép SSH: sudo ufw allow OpenSSH
- Mở cổng web:
  - sudo ufw allow 80
  - sudo ufw allow 443
- Bật firewall:
  - sudo ufw enable
- Đặc biệt:
  - Chặn các kết nối bên ngoài vào VPS
    - sudo ufw default deny incoming
  - Cho phép VPS chủ động ra ngoài internet
    - sudo ufw default allow outgoing
- Kiểm tra
  - sudo ufw status numbered

5. Cài đặt chứng chỉ SSL (Let's Encrypt)
6. Khởi chạy:

- .init-letsencrypt.sh
- docker compose up -d
- Build lại service: docker compose up -d --build nginx
- Kiểm tra danh sách các container: docker compose ps
- Tắt và xóa container cũ: docker compose down
- Bật lại chế độ scale: docker compose up -d --build
- Xem log backend: docker compose logs -f backend
- Tắt 1 con backend: docker stop cnweb_aiflashcard-backend-1
- Bật lại: docker start cnweb_aiflashcard-backend-1
