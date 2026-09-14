# Ingredient Signal Data

바코드 기반 원재료명 분석을 위한 검수형 식품 데이터 저장소입니다.

## 원칙

- 제품 하나당 JSON 파일 하나를 `products/<앞 3자리>/<바코드>.json`에 저장합니다.
- 원재료명은 포장지에 표시된 텍스트를 가능한 그대로 기록합니다.
- 개인정보·영수증·사용자 사진 원본은 저장하지 않습니다.
- 출처와 검수 상태를 반드시 기록합니다.
- PR 검증을 통과한 데이터만 `main`에 병합합니다.

## 추가 방법

1. `templates/product.example.json`을 복사합니다.
2. `products/<앞 3자리>/<바코드>.json` 경로에 저장합니다.
3. `npm run validate`를 통과한 뒤 Pull Request를 엽니다.

`barcode`는 숫자 8~14자리여야 하며, 파일 경로와 동일해야 합니다.

## 앱 조회 흐름

성분 시그널 스캐너는 자체 데이터 저장소를 먼저 조회하고, 제품이 없으면 Open Food Facts를 fallback으로 조회합니다.
