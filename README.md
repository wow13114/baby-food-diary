# 이솔이의 밥상일기 🥣

이유식·유아식 식사 기록 앱

## 배포 방법

### Vercel (추천, 무료)

1. [GitHub](https://github.com)에 가입 후 새 레포 생성
2. 이 폴더 파일을 모두 업로드 (또는 `git push`)
3. [Vercel](https://vercel.com)에서 **"Add New Project"** → GitHub 레포 선택
4. 설정 없이 **Deploy** 클릭 — 자동으로 감지됩니다
5. 완료! `https://your-project.vercel.app` 주소로 접속 가능

### Netlify (대안, 무료)

1. [Netlify](https://netlify.com) 가입
2. **"Add new site" → "Deploy manually"**
3. `npm run build` 후 생성된 `dist/` 폴더를 드래그 앤 드롭

## 로컬 실행

```bash
npm install
npm run dev
```

## 데이터 저장

- 브라우저 `localStorage`에 저장됩니다
- 기기마다 별도 저장 (공유 안 됨)
- 브라우저 데이터 삭제 시 초기화되니 주의하세요
