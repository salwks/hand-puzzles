# 손으로 두는 퍼즐 (모션 트래킹)

웹캠 핸드 트래킹(MediaPipe)으로 만든 3D 손으로 말과 조각을 집어 옮기는 퍼즐 모음. Three.js 3D, 마우스/터치도 지원.

- **솔리테어 체스** (`chess.html`) — 4×4 판에서 매 수마다 반드시 말을 잡아 하나만 남긴다.
- **다섯 칸** (`penta.html`) — 펜토미노 조각을 돌리고 뒤집어 5×N 판을 빈칸 없이 채운다.
  - 회전: 집은 채 손목 비틀기(1.6배 증폭, 90° 스냅) · 마우스 휠 · R/Q/E · 도크 버튼
  - 뒤집기: 집은 채 손을 뒤집기(손바닥↔손등, 2D 관절 배치의 부호로 판정) · 우클릭 · F · 도크 버튼
  - 조각은 집은 지점을 축으로 돌고 뒤집히며, 놓일 자리는 판 위에 초록(가능)/붉은(불가) 자국으로 표시된다.
- **마작** (`mahjong.html`) — AI 세 명과 치는 리치 마작 동풍전. 산에서 패를 집어 오고, 하천에 버리고, 버릴 패를 비틀어 눕히면 리치, 남의 버림패를 끌어오면 퐁·치·깡·론.
- **고스톱** (`gostop.html`) — AI 두 명과 치는 3인 고스톱. 손패를 집어 같은 달 위에 내려치고(빠를수록 세게 '짝!'), 더미를 집어 뒤집고, 엄지 척은 고 · 손바닥은 스톱.
- **물놀이** (`water.html`) — 물이 든 수조를 손으로 휘젓는 놀이. WebGPU에서는 [Splash](https://github.com/matsuoka-601/Splash)(MIT, `vendor/splash/`)의 입자 물(MLS-MPM), 그 밖에서는 얕은 물 방정식 수면 버전. 배경 스카이박스: three.js 예제 "Bridge2" (Emil Persson, aka Humus, http://www.humus.name — 출처 표기 조건으로 무료).
- **궤도 방어** (`orbit.html`) — 가운데 우주선으로 사방에서 돌진하는 적(15종)과 스테이지 보스(5종)를 막는 슈팅. 펴진 손의 손목 각도로 포신을 겨누는 다이얼 조작(±90° → 360°), 레이저 자동 연사, 주먹 = EMP. 규칙 엔진 `app/orbit-logic.js`, 테스트 `tools/test-orbit-logic.mjs`. 효과음: Kenney "Sci-fi Sounds"·"Digital Audio" (CC0, `assets/sfx/orbit/`).
- `index.html` — 게임 선택 화면.

## 실행

카메라(getUserMedia)와 ES 모듈 때문에 `file://`이 아닌 localhost로 열어야 한다.

```bash
python3 serve.py
```

→ http://localhost:8765

## 구조

공통
- `app/stage.js` — 3D 무대: 렌더러, 스탠드 조명·그림자, 가죽 테이블, 카메라, 트윈, 추적 손(게임 씬이 상속)
- `app/shell.js` — 공통 UI: 카메라/손 입력 → 드래그 이벤트, 보정 패널, 추적 표시, 토스트, 시작 화면
- `app/hand.js` — MediaPipe HandLandmarker → 미러링/스무딩된 커서, 핀치, 손목 롤(roll), 손 뒤집힘(facing)
- `app/rigged-hand.js` — 사실적인 손: WebXR generic-hand 스킨 메시(`assets/hand-*.glb`, MIT)를 랜드마크로 리타게팅
- `app/materials.js` — 절차적 PBR 재질: 니스 칠한 나무(색·범프 맵), 상아, 가죽, 접촉 그림자
- `app/log.js`, `tools/analyze_log.py` — 진단 로그

솔리테어 체스
- `app/game.js` — 규칙, DFS 솔버, 퍼즐 생성기 · `app/pieces.js` — 3D 말 · `app/scene.js` — 체스 씬 · `app/main.js` — 게임

다섯 칸
- `app/penta-logic.js` — 조각 정의, 회전/뒤집기 변환(three.js 회전과 같은 규약), 정확 덮개 솔버, 생성기
- `app/penta-scene.js` — 판·조각(외곽선 압출), 집은 지점 축 회전/뒤집기, 놓일 자리 표시, 화면비별 트레이 배치
- `app/penta.js` — 게임 상태, 손목 비틀기/손 뒤집기 → 회전·뒤집기, 탭 선택, 힌트, 되돌리기

## WiLoR 3D 보정 (선택)

[WiLoR](https://github.com/rolpotamias/WiLoR)(단일 이미지 3D 손 메시 복원)를 보조 엔진으로 붙일 수 있다.
브라우저가 웹캠 프레임을 `ws://localhost:8766`으로 보내고, 서버가 3D 관절과 손바닥 좌표계를 돌려준다.
M1에서 ViT-H 백본이 프레임당 ~300 ms라 실시간은 아니므로, MediaPipe가 커서·핀치(60 fps)를 맡고
WiLoR는 손바닥 방향(뒤집기)과 손목 각도(회전)만 ~3 fps로 보정한다. 서버가 없으면 자동으로 MediaPipe만 쓴다.

```bash
python3 -m venv .venv-wilor && .venv-wilor/bin/pip install setuptools wheel numpy   && .venv-wilor/bin/pip install --no-build-isolation "git+https://github.com/warmshao/WiLoR-mini" websockets opencv-python
./start-wilor.sh     # 첫 실행 시 모델(~2.5 GB)을 내려받는다
```

보정 패널의 「WiLoR 3D 보정」 스위치로 끄고 켤 수 있다. 서버·클라이언트: `wilor_server.py`, `app/wilor-client.js`.

마작
- `app/mj-logic.js` — 샹텐, 대기, 분해, 역 24종, 부수, 점수, 울기, AI 버림패 (`tools/test-mj-logic.mjs`) · `app/mj-scene.js` — 펠트 테이블, 2층 패(상아·비취), 산·손패·하천·울기 배치. 패 그림은 [FluffyStuff/riichi-mahjong-tiles](https://github.com/FluffyStuff/riichi-mahjong-tiles)(CC0, `assets/tiles/`) · `app/mj.js` — 대국 진행, 울기 창, 리치, 화료·유국 정산, AI · `app/sound.js` — 효과음·징글. 녹음 샘플은 [Kenney](https://kenney.nl) Casino Audio · Impact Sounds · Music Jingles (CC0, `assets/sfx/`)

고스톱
- `app/gs-logic.js` — 화투 48장, 한 턴 판정(뻑·쪽·따닥·싹쓸이·폭탄·흔들기), 점수, 고 배수, 광박·피박·고박·나가리 정산, AI (`tools/test-gs-logic.mjs`) · `app/gs-scene.js` — 담요 테이블, 화투 카드, 내려치기·흔들림 · `app/gs.js` — 판 진행, 고/스톱 손 모양 인식, 가이드. 화투 그림은 Wikimedia Commons [SVG Hwatu](https://commons.wikimedia.org/wiki/Category:SVG_Hwatu) (CC BY-SA 4.0, `assets/hwatu/`)

## 손 인식 진단 로그

카메라를 켜고 플레이하면 프레임별 수치(핀치 비율, 임계값, 손 속도, 추적 신뢰도, 커서)와
집기/놓기 이벤트가 `logs/<세션>.jsonl`에 기록된다(영상은 기록하지 않음, localhost 전용).

```bash
python3 tools/analyze_log.py
```
