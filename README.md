## 실행방법: 
## docker compose up --build -d

## localhost:3000 에서 gateway 서버 실행.

@@@@@@ GET METHOD @@@@@@

- localhost:3000 -> 게이트웨이 서버 상태 체크
- localhost:3000/profile?token=JWT_TOKEN -> 토큰 유저 정보 확인
- localhost:3000/checkRole?token=JWT_TOKEN -> 토큰 유저 역할 확인
- localhost:3000/checkEvent?id=EVENT_ID -> 이벤트 정보 확인
- localhost:3000/getRewardRequestHistory?id=REQUEST_ID -> 이벤트 보상 요청 내역 확인

@@@@@@ POST METHOD @@@@@@

- localhost:3000/register -> 회원가입: body parameter -> info json {id: string, pw: string, role: Role (Number)}
- localhost:3000/login -> 로그인: body parameter -> info json {id: string, pw: string, role?; Role (Number)}
- localhost:3000/changeRole -> 자신의 역할 변경: body parameter -> role: string, header: authorization token -> JWT_TOKEN
- localhost:3000/createEvent -> 이벤트 생성: body parameter -> event json {id: string, condition: string, name: string, reward: string}, header: authorization token -> JWT_TOKEN
- localhost:3000/editEvent -> 이벤트 수정: body parameter -> event json {id: string, condition: string, name: string, reward: string}, header: authorization token -> JWT_TOKEN
- localhost:3000/requestReward -> 유저 보상 요청: body parameter -> event request json {userid: string, requestid: string, eventid: string, token: string, success: boolean}, header: authorization token -> JWT_TOKEN.

## Description:
이벤트 종류는 최대한 간단한 연속 3일을 보는 것으로 했습니다. 또한 어떠한 이벤트가 생기더라도 user 데이터베이스를 업데이트 하며 새로운 이벤트를 추가 가능합니다.
이벤트 아이디와 리워드를 문자열로 하여 추후에 이벤트들 또한 용이하게 변경할 수 있도록 했습니다. 
처음에는 monorepo 방식을 조금 더 선호하여 서버간의 중복되는 패키지를 줄이고자 하였으나, 개인사정으로 3일이라는 시간 밖에 없었던 탓에 제일 간편한 서버형식을 채택했습니다.
이 밖에 많은 기능들을 최소한으로 구현하였습니다. 너무 복잡한 기능들은 연산속도를 낮출 수 있으니 백엔드에서는 최대한 빠른 연산만을 생각하였습니다.