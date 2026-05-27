# CRIMSON SURVIVAL

귀여운 뱀파이어가 점점 악마화되며 종말 속에서 살아남는 다크 판타지 로그라이크 생존게임.

현재 저장소는 Phaser/Vite 기반 플레이어블 프로토타입입니다. 원본 목표인 Unity 2D 구현으로 옮길 때도 같은 데이터와 우선순위를 따라가도록 하네스 문서를 함께 둡니다.

## 실행

```bash
npm install
npm run dev
```

## 빌드 검증

```bash
npm run build
```

## 난이도 테스트

기본은 `NORMAL`입니다. URL 쿼리로 난이도를 바꿀 수 있습니다.

- `/?difficulty=NORMAL`
- `/?difficulty=NIGHTMARE`
- `/?difficulty=DEMON`

## 현재 구현

- WASD/방향키 이동, 카메라 추적, 픽셀 렌더링
- 주변 랜덤 몬스터 스폰, 시간 기반 밀도 증가, 엘리트 몬스터
- 가장 가까운 적 자동 공격, 투사체 풀링
- 경험치 젬, 자동 흡수, 레벨업 선택 UI
- 5분 단위 침식 단계와 플레이어 악마화 틴트/스케일
- 10/20/30분 보스 스케줄과 보스 체력 UI
- Blood Coin 로컬 저장 기반 메타 성장 뼈대

## 기획/개발 하네스

상세 하네스는 [CRIMSON_SURVIVAL_HARNESS.md](/workspaces/CRIMSON-SURVIVAL/CRIMSON_SURVIVAL_HARNESS.md)를 기준으로 합니다.
