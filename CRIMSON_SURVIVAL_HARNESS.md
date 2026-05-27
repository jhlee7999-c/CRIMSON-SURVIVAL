# CRIMSON SURVIVAL Full Vibe Coding Harness

## One Line

귀여운 뱀파이어가 점점 악마화되며 종말 속에서 살아남는 다크 판타지 로그라이크 생존게임.

## Product Direction

CRIMSON SURVIVAL은 Vampire Survivors 계열을 오마주한 30분 생존형 자동 공격 게임이다. 핵심은 복잡한 혁신이 아니라 익숙한 생존 루프, 강한 고딕 분위기, 후반 악마화 연출, 중독성 있는 빌드 조합, 안정적인 프레임이다.

절대 우선순위:

1. 타격감
2. 레벨업 만족감
3. 후반 종말 분위기
4. 60FPS 유지
5. 진화 연출의 쾌감

하지 말 것:

- 멀티플레이
- 랜덤맵 생성
- 복잡한 스킬트리
- 과도한 탄막
- 복잡한 스토리 시스템

## Core Run Structure

한 판은 30분이다.

| 시간 | 목적 | 이벤트 |
| --- | --- | --- |
| 0~10분 | 성장 구간 | 기본 몬스터, 초반 무기 확보 |
| 10분 | 1차 체크 | 거대 박쥐 보스 |
| 10~20분 | 빌드 완성 | 엘리트 증가, 패시브 조합 |
| 20분 | 2차 체크 | 붉은 백작 보스 |
| 20~30분 | 종말 단계 | 사신 등장, 화면 붉어짐 |
| 30분 | 최종전 | 사신 보스, 종말 연출 |

## Difficulty

| 키 | 이름 | 맵 | 디자인 |
| --- | --- | --- | --- |
| NORMAL | 붉은 밤 | 공동묘지 | 입문용, 낮은 밀도, 느린 침식 |
| NIGHTMARE | 피의 달 | 붉은 성 | 적 증가, 엘리트 강화, 붉은 달 |
| DEMON | 종말 | 종말의 성역 | 몬스터 폭증, 화면 왜곡, 후반 압박 |

## Maps

### 공동묘지

- NORMAL 기본 맵
- 푸른 밤, 안개, 묘비, 차가운 피아노
- 좀비, 박쥐, 해골

### 붉은 성

- NIGHTMARE 기본 맵
- 붉은 달, 고딕 성, 핏빛 창문
- 흡혈귀, 유령, 갑옷 기사

### 종말의 성역

- DEMON 기본 맵
- 붉은 하늘, 균열, 지옥 불꽃
- 악마, 사신, 타락 천사

## Characters

### Lilith

- 컨셉: 귀여운 뱀파이어 소녀, 균형형, 흡혈 특화
- 기본 무기: 암흑 구체
- 패시브: 흡혈 +5%
- 외형 변화:
  - 초반: 귀여운 소녀
  - 중반: 눈 붉어짐
  - 후반: 박쥐 날개
  - 종말: 악마 여왕

### Cain

- 컨셉: 저주받은 사신 검사, 근접 폭딜형
- 기본 무기: 사신의 낫
- 패시브: 치명타 +10%
- 외형 변화:
  - 초반: 검은 코트
  - 중반: 붉은 오라
  - 후반: 저주 갑옷
  - 종말: 사신 형태

## Weapons

무기 슬롯은 최대 6개다. 각 무기는 최대 8레벨을 기준으로 한다.

| 무기 | 역할 | 구현 우선순위 |
| --- | --- | --- |
| 암흑 구체 | 자동 추적 | 1 |
| 박쥐 떼 | 흡혈 | 3 |
| 번개서 | 폭딜 | 2 |
| 사신의 낫 | 근접 | 2 |
| 저주 마늘 | 생존 오라 | 2 |
| 얼음 수정 | 빙결 | 4 |
| 성수병 | 장판 | 3 |
| 유령 촛불 | 화상 | 4 |

## Passives

패시브 슬롯은 최대 6개다. 각 패시브는 최대 5레벨을 기준으로 한다.

| 패시브 | 효과 |
| --- | --- |
| 마도서 | 투사체 증가 |
| 검은 심장 | 치명타 증가 |
| 시계 | 쿨다운 감소 |
| 촛대 | 범위 증가 |
| 박쥐 날개 | 이동속도 증가 |
| 철십자가 | 방어 증가 |
| 흡혈 성배 | 회복량 증가 |
| 황금 왕관 | 경험치 증가 |

## Evolutions

진화 조건:

1. 무기 MAX 레벨
2. 특정 패시브 보유
3. 엘리트 상자 획득

| 무기 | 패시브 | 진화 |
| --- | --- | --- |
| 번개서 | 시계 | 천벌 폭풍 |
| 사신의 낫 | 검은 심장 | 월식의 대낫 |
| 박쥐 떼 | 흡혈 성배 | 흡혈 군단 |

진화 연출 기준:

- 화면 0.25초 정지감
- 붉은 원형 플래시
- UI 노이즈
- 새 무기 이름 대형 표시
- 다음 3초간 해당 무기 공격 빈도 보너스

## Corruption System

침식은 5분마다 증가한다.

| 시간 | 변화 |
| --- | --- |
| 5분 | 적 증가 |
| 10분 | 엘리트 등장 |
| 15분 | 화면 붉어짐 |
| 20분 | 몬스터 강화 |
| 25분 | 사신 등장 |
| 30분 | 종말 |

연출 요소:

- 배경 색상 변화
- 붉은 필터
- 음악 왜곡
- 몬스터 색상 변화
- UI 노이즈
- DEMON 난이도에서 약한 화면 흔들림과 색수차 느낌

## Bosses

| 시간 | 보스 | 패턴 | 보상 |
| --- | --- | --- | --- |
| 10분 | 거대 박쥐 | 돌진, 박쥐 소환 | 엘리트 상자 |
| 20분 | 붉은 백작 | 탄막, 순간이동, 흡혈 | 엘리트 상자 |
| 30분 | 사신 | 광역 낫, 시간 압박 | 클리어 보상 |

## Meta Progression

재화는 Blood Coin이다. 저장은 JSON 또는 로컬 저장으로 시작한다.

영구 업그레이드:

- 체력 증가, 최대 5레벨
- 공격력 증가, 최대 5레벨
- 이동속도 증가, 최대 5레벨
- 경험치 획득 증가, 최대 5레벨
- 시작 무기 추가, 최대 1레벨

밸런스 제한:

- 영구 업그레이드는 각 효과당 5~8% 수준으로 제한한다.
- 공격력과 경험치 보너스는 초반 체감만 주고 후반 빌드 완성을 대체하지 않게 한다.
- 난이도 DEMON은 메타 풀업 기준으로도 압박이 남아야 한다.

## Technical Harness

현재 프로토타입은 Phaser/Vite로 작성되어 있고, 최종 Unity 2D 구현 시 같은 모듈 경계를 유지한다.

| 현재 파일 | Unity 이전 대응 |
| --- | --- |
| `src/data/GameData.ts` | ScriptableObject 데이터 |
| `src/entities/Player.ts` | PlayerController |
| `src/entities/Monster.ts` | MonsterController |
| `src/entities/Boss.ts` | BossController |
| `src/systems/MonsterManager.ts` | SpawnManager |
| `src/systems/WeaponSystem.ts` | WeaponManager |
| `src/systems/ExperienceManager.ts` | ExperienceManager |
| `src/systems/CorruptionSystem.ts` | DemonCorruptionManager |
| `src/systems/MetaProgression.ts` | SaveData + MetaUpgradeManager |
| `src/scenes/UIScene.ts` | HUD + LevelUpPanel |

## Unity Folder Structure

```text
Assets/
  Scripts/
    Core/
    Entities/
    Systems/
    Weapons/
    UI/
    Data/
  Prefabs/
    Player/
    Monsters/
    Bosses/
    Weapons/
    Pickups/
  Sprites/
  Audio/
  Materials/
  ScriptableObjects/
  UI/
  Scenes/
```

## Performance Rules

필수:

- Object Pooling
- Update 최소화
- Sprite Atlas 사용
- 카메라 밖 스폰과 비활성화
- 충돌 판정 단순화

금지:

- Instantiate 남발
- Find 반복 호출
- 과도한 파티클
- 몬스터마다 비싼 탐색
- 매 프레임 LINQ 또는 GC allocation

목표:

- 모바일 60FPS
- 화면 내 몬스터 500마리 기준 버티기
- 투사체/젬 풀링 기본 적용

## MVP Scope

- 캐릭터 2명: Lilith, Cain
- 맵 3개: 공동묘지, 붉은 성, 종말의 성역
- 무기 8개
- 패시브 8개
- 보스 3종
- 침식 6단계
- Blood Coin 메타 성장

## Development Order

1. 플레이어 이동
2. 몬스터 생성
3. 자동 공격
4. 경험치 / 레벨업
5. 무기 시스템
6. 보스 시스템
7. 진화 시스템
8. 침식 연출
9. 메타 성장
10. 사운드 / 타격감 / 최적화

## Coding Prompts

### Player Movement

Unity 2D 기준 Vampire Survivors 스타일 플레이어 이동 시스템을 만든다.

조건:

- WASD 이동
- 모바일 조이스틱 대응
- Rigidbody2D 사용
- 부드러운 이동 가속
- Sprite Flip 지원
- 픽셀 도트 애니메이션 연동
- 성능 최적화 고려

### Monster Spawn

Unity 2D 로그라이크 생존게임 몬스터 스폰 시스템을 만든다.

조건:

- 플레이어 주변 랜덤 스폰
- 카메라 바깥 원형 또는 링 스폰
- 시간 지날수록 적 증가
- 10분 이후 엘리트 몬스터 지원
- Object Pooling 사용
- 모바일 최적화

### Auto Attack

Unity 2D 자동 공격 시스템을 만든다.

조건:

- 가장 가까운 적 자동 탐색
- 공격속도 스탯 연동
- Object Pooling 사용
- 추후 무기 확장 가능 구조
- 모바일 최적화

### Experience And Level Up

Unity 2D 로그라이크 경험치 및 레벨업 시스템을 만든다.

조건:

- 적 처치 시 경험치 드랍
- 경험치 자동 흡수
- 레벨업 시 무기/패시브 선택
- 최대 슬롯 제한 적용
- ScriptableObject 기반 데이터 구조

### Weapon System

Unity 2D 로그라이크 무기 시스템을 만든다.

조건:

- ScriptableObject 기반
- 무기 레벨업 지원
- 투사체 무기 구조
- 범위 공격 구조
- 상태이상 최소 구현
- 확장 가능한 구조

### Evolution System

Unity 2D 로그라이크 무기 진화 시스템을 만든다.

조건:

- 특정 패시브 보유 시 진화 가능
- 엘리트 상자 획득 시 진화
- 진화 연출 지원
- 데이터 기반 구조

### Demon Corruption

Unity 2D Demon Corruption 시스템을 만든다.

조건:

- 5분마다 단계 상승
- 화면 색감 변화
- 몬스터 강화
- 배경 분위기 변경
- UI 노이즈 효과
- 성능 최적화 고려

### Boss System

Unity 2D 로그라이크 보스 시스템을 만든다.

조건:

- 10분마다 보스 등장
- 패턴 기반 AI
- 돌진 / 탄막 / 소환 패턴 지원
- 체력 UI 표시
- 보스 처치 보상 상자 생성

### Meta Progression

Unity 2D 메타 성장 시스템을 만든다.

조건:

- Blood Coin 재화 저장
- 영구 업그레이드 시스템
- JSON 저장 지원
- 게임 밸런스 붕괴 방지 제한 포함
