export interface KeywordNode {
  id: string
  label: string
  strength: number
  isNew: boolean
  domain: string[]
  connectedTo: string[]
}

export interface Connection {
  from: string
  to: string
  type: 'strong' | 'weak' | 'cross-industry'
  strength: number
}

export interface DimensionNode {
  label: string
  type: 'cause' | 'center' | 'effect' | 'open'
  dataPoint?: string
}

export interface DimensionLayer {
  id: string
  label: string
  icon: string
  nodes: DimensionNode[]
}

export interface CausalNodeSource {
  label: string
  url: string
}

export interface CausalNode {
  id: string
  headline: string
  source?: string
  date?: string
  dataPoint?: string
  summary?: string
  sources?: CausalNodeSource[]
  type: 'cause' | 'center' | 'effect' | 'open'
  depth: number
}

export interface CausalEdge {
  from: string
  to: string
  label?: string
}

export interface PerspectiveGuide {
  id: string
  label: string
  position: 'top' | 'bottom' | 'left' | 'right'
  focusNodeIds: string[]
  questions: string[]
  interpretation?: string
  markerCoord?: { lat: number; lng: number }
}

export interface CausalGraph {
  nodes: CausalNode[]
  edges: CausalEdge[]
  guides?: PerspectiveGuide[]
}

export interface SignalDetail {
  keywordId: string
  news: {
    title: string
    summary: string
    source: string
    date: string
    url: string
  }[]
  timeline: {
    firstSeen: string
    peakDate: string
  }
  relatedSignals: {
    id: string
    label: string
    isWeak: boolean
  }[]
  dimensions?: DimensionLayer[]
  causalGraph?: CausalGraph
}

export const DOMAINS = ['경제', '사회', '생활/문화', 'IT/과학', '세계', '랭킹']

export const KEYWORDS_BY_DOMAIN: Record<string, KeywordNode[]> = {
  '경제': [
    { id: 'kw101', label: '성장률 1%대가 뉴노멀이 됐다', strength: 0.9, isNew: true, domain: ['경제'], connectedTo: ['kw102', 'kw112', 'kw133'] },
    { id: 'kw102', label: '원화 1,450원의 경고', strength: 0.75, isNew: true, domain: ['경제', '세계'], connectedTo: ['kw101', 'kw126'] },
    { id: 'kw103', label: '삼성, TSMC에 뒤처지는 증거', strength: 0.85, isNew: true, domain: ['경제', 'IT/과학'], connectedTo: ['kw101', 'kw120', 'kw127'] },
    { id: 'kw104', label: '다주택자 매물이 쏟아진다', strength: 0.8, isNew: true, domain: ['경제'], connectedTo: ['kw108'] },
    { id: 'kw105', label: '금리 내려도 지갑 안 열리는 이유', strength: 0.65, isNew: false, domain: ['경제'], connectedTo: ['kw101', 'kw116'] },
    { id: 'kw106', label: 'K-바이오가 다음 반도체인 이유', strength: 0.7, isNew: true, domain: ['경제', 'IT/과학'], connectedTo: ['kw109'] },
  ],
  '사회': [
    { id: 'kw107', label: '출산율 0.72, 공황 수준인 이유', strength: 0.95, isNew: false, domain: ['사회'], connectedTo: ['kw108', 'kw109', 'kw132'] },
    { id: 'kw108', label: '집값이 결혼을 막는 구조', strength: 0.85, isNew: false, domain: ['사회', '경제'], connectedTo: ['kw107', 'kw104'] },
    { id: 'kw109', label: '65세가 5명 중 1명이 됐다', strength: 0.9, isNew: false, domain: ['사회'], connectedTo: ['kw107', 'kw110', 'kw106'] },
    { id: 'kw110', label: '의사들이 병원 떠나는 이유', strength: 0.75, isNew: true, domain: ['사회'], connectedTo: ['kw109'] },
    { id: 'kw111', label: '2050년 노인 40%의 의미', strength: 0.7, isNew: false, domain: ['사회'], connectedTo: ['kw109', 'kw132'] },
    { id: 'kw112', label: '정부 저출생 예산이 30조인 이유', strength: 0.6, isNew: true, domain: ['사회', '경제'], connectedTo: ['kw107'] },
  ],
  '생활/문화': [
    { id: 'kw113', label: '1인가구가 처음으로 최다가 됐다', strength: 0.85, isNew: false, domain: ['생활/문화'], connectedTo: ['kw107', 'kw114'] },
    { id: 'kw114', label: '배달비 5천원 시대의 부작용', strength: 0.7, isNew: true, domain: ['생활/문화', '경제'], connectedTo: ['kw113'] },
    { id: 'kw115', label: '러닝이 전 세대를 관통한 이유', strength: 0.75, isNew: true, domain: ['생활/문화'], connectedTo: [] },
    { id: 'kw116', label: '명품은 팔리고 마트는 텅텅', strength: 0.8, isNew: true, domain: ['생활/문화', '경제'], connectedTo: ['kw101', 'kw105'] },
    { id: 'kw117', label: 'K-푸드, K-팝보다 더 오래간다', strength: 0.65, isNew: true, domain: ['생활/문화', '세계'], connectedTo: [] },
    { id: 'kw118', label: '편의점이 슈퍼를 완전히 이긴 날', strength: 0.6, isNew: false, domain: ['생활/문화'], connectedTo: ['kw113'] },
  ],
  'IT/과학': [
    { id: 'kw119', label: 'AI 에이전트, 사람 업무를 대신하다', strength: 0.95, isNew: true, domain: ['IT/과학'], connectedTo: ['kw120', 'kw123', 'kw134'] },
    { id: 'kw120', label: 'HBM이 AI 전쟁의 진짜 병목', strength: 0.9, isNew: true, domain: ['IT/과학', '경제'], connectedTo: ['kw119', 'kw103', 'kw127', 'kw131'] },
    { id: 'kw121', label: 'AI 프로젝트 90%가 PoC에 멈춘다', strength: 0.8, isNew: false, domain: ['IT/과학'], connectedTo: ['kw119'] },
    { id: 'kw122', label: '양자 암호 전환, 지금 해야 할 이유', strength: 0.6, isNew: true, domain: ['IT/과학'], connectedTo: [] },
    { id: 'kw123', label: '오픈소스 AI, GPT를 따라잡은 순간', strength: 0.75, isNew: true, domain: ['IT/과학'], connectedTo: ['kw119', 'kw121'] },
    { id: 'kw124', label: '한국 AI G3 목표, 현실적인가', strength: 0.7, isNew: false, domain: ['IT/과학', '세계'], connectedTo: ['kw119', 'kw120'] },
  ],
  '세계': [
    { id: 'kw125', label: '트럼프 관세, 한국이 잃은 것', strength: 0.9, isNew: true, domain: ['세계', '경제'], connectedTo: ['kw101', 'kw102', 'kw128'] },
    { id: 'kw126', label: '달러 패권에 균열이 보이기 시작했다', strength: 0.8, isNew: false, domain: ['세계'], connectedTo: ['kw102'] },
    { id: 'kw127', label: '중국 반도체 굴기가 성공하면', strength: 0.85, isNew: true, domain: ['세계', 'IT/과학'], connectedTo: ['kw103', 'kw120', 'kw125'] },
    { id: 'kw128', label: 'AI 칩 수요가 관세 충격을 덮는다', strength: 0.75, isNew: true, domain: ['세계', 'IT/과학'], connectedTo: ['kw119', 'kw125'] },
    { id: 'kw129', label: 'EV 성장 둔화, 일시적인가 구조적인가', strength: 0.65, isNew: false, domain: ['세계', '경제'], connectedTo: [] },
    { id: 'kw130', label: '탄소세 Phase 4, 기업 비용 충격', strength: 0.7, isNew: true, domain: ['세계', '경제'], connectedTo: ['kw101'] },
  ],
  '랭킹': [
    { id: 'kw131', label: '메모리 반도체 1위, 언제까지', strength: 0.85, isNew: true, domain: ['랭킹', 'IT/과학'], connectedTo: ['kw120', 'kw127'] },
    { id: 'kw132', label: '출산율 OECD 꼴찌, 몇 년째인가', strength: 0.9, isNew: false, domain: ['랭킹', '사회'], connectedTo: ['kw107', 'kw109'] },
    { id: 'kw133', label: 'GDP 성장률 G20 하위권 진입', strength: 0.8, isNew: true, domain: ['랭킹', '경제'], connectedTo: ['kw101'] },
    { id: 'kw134', label: '국가 AI 경쟁력, 한국 순위는', strength: 0.75, isNew: true, domain: ['랭킹', 'IT/과학'], connectedTo: ['kw119', 'kw124'] },
    { id: 'kw135', label: '서울 생활비 순위가 오르는 이유', strength: 0.65, isNew: false, domain: ['랭킹', '생활/문화'], connectedTo: ['kw108'] },
    { id: 'kw136', label: '글로벌 시총 100위서 한국이 사라진다', strength: 0.7, isNew: false, domain: ['랭킹', '경제'], connectedTo: ['kw101', 'kw103'] },
  ],
}

export const ALL_KEYWORDS: KeywordNode[] = Object.values(KEYWORDS_BY_DOMAIN).flat()

export const SIGNAL_DETAILS: Record<string, SignalDetail> = {
  kw121: {
    keywordId: 'kw121',
    news: [
      {
        title: '맥킨지 조사: 기업 AI 프로젝트 88%, 프로덕션 도달 실패',
        summary: '전 세계 1,500개 기업 조사 결과. PoC 완료까지 평균 6주, 프로덕션 배포까지 18개월. 실패 원인 1위는 "데이터 품질"(70%), 기술 부족을 꼽은 기업은 12%에 불과. "AI는 준비됐는데 기업이 준비 안 됐다"는 결론.',
        source: 'McKinsey Global Institute',
        date: '2026.04.08',
        url: '#',
      },
      {
        title: '삼성·SK·LG, 사내 AI 사용 전면 감사 후 외부 API 차단 확대',
        summary: 'ChatGPT 기밀 코드 유출 사태 이후 국내 대기업 68%가 외부 AI API 사용 제한·금지 정책 강화. 직원들은 개인 계정으로 우회하고, 보안팀은 차단 솔루션을 도입하는 "숨바꼭질" 상황. 그 결과 자체 온프레미스 LLM 수요 전년비 280% 증가.',
        source: '한국경영자총협회',
        date: '2026.03.25',
        url: '#',
      },
    ],
    timeline: { firstSeen: '03.10', peakDate: '04.08' },
    relatedSignals: [
      { id: 'kw119', label: 'AI 에이전트, 사람 업무를 대신하다', isWeak: false },
      { id: 'kw123', label: '오픈소스 AI, GPT를 따라잡은 순간', isWeak: false },
      { id: 'kw124', label: '한국 AI G3 목표, 현실적인가', isWeak: true },
    ],
    causalGraph: {
      nodes: [
        // depth 0 — 구조적 원인
        {
          id: 'rn1', headline: 'IT 인프라 레거시 17년 — 데이터가 1990년대에 갇혀있다',
          source: '가트너', date: '03.2026', dataPoint: '대기업 ERP 평균 도입 연도 2008년',
          type: 'cause', depth: 0,
          summary: '국내 주요 대기업 IT 인프라를 분석한 결과, 핵심 ERP·CRM 시스템의 평균 도입 연도가 2008년이다. 이 시스템들은 정형화된 관계형 DB에 데이터를 저장하도록 설계되어 있어, PDF·이메일·음성 형태의 비구조화 데이터를 AI가 활용하려면 별도 ETL 파이프라인이 필요하다. 이 파이프라인 구축에만 평균 8개월, 비용 5~10억원이 소요된다.',
          sources: [
            { label: 'Gartner — ERP 최신 인사이트', url: 'https://www.gartner.com/en/information-technology/topics/enterprise-resource-planning' },
            { label: 'McKinsey — The data and AI future (2025)', url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-data-and-ai-future' },
          ],
        },
        {
          id: 'rn2', headline: 'AI 사고 발생 시 법적 책임 주체 공백 — 아무도 서명 못 한다',
          source: '법무부', date: '04.2026', dataPoint: 'AI 책임법 국회 계류 2년째',
          type: 'cause', depth: 0,
          summary: 'AI가 틀린 판단을 내려 손해가 발생했을 때 누가 책임지는가. 현재 법적 공백이다. AI 개발사, AI 도입 기업, AI를 사용한 담당자 중 책임 주체가 불명확하다. 이 때문에 법무·재무·인사 부서는 AI 도입에 사인을 거부한다. 국내 AI 책임법은 2년째 국회에 계류 중이며 통과 시점이 불투명하다.',
          sources: [
            { label: 'EU AI Act 공식 텍스트', url: 'https://artificialintelligenceact.eu/' },
            { label: 'KISA — 생성형 AI 보안 가이드라인 (2023)', url: 'https://www.kisa.or.kr/post/fileDownload?menuSeq=20301&postSeq=18&attachSeq=1&lang_type=KO' },
          ],
        },
        // depth 1 — 직접 원인
        {
          id: 'n1', headline: '기업 데이터 70%가 비구조화 — AI가 읽지 못하는 형태',
          source: 'McKinsey', date: '04.2026', dataPoint: '파이프라인 구축만 평균 8개월',
          type: 'cause', depth: 1,
          summary: '기업이 보유한 데이터의 70%는 PDF 계약서, 이메일, 엑셀, 발표자료 등 AI가 직접 처리하기 어려운 비구조화 형태다. LLM은 이런 데이터를 바로 참조할 수 없다. 전처리·정제·분류 작업이 선행되어야 하며, 이 단계에서 대부분의 프로젝트가 "우리 데이터는 특수하다"는 이유로 무기한 연기된다.',
          sources: [
            { label: 'McKinsey — The state of AI (2025)', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
            { label: 'McKinsey — The state of AI in early 2024', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2024' },
          ],
        },
        {
          id: 'n2', headline: '사내 데이터 외부 API 전송 = 보안 규정 위반',
          source: '한경총', date: '03.2026', dataPoint: '대기업 68% 외부 AI API 차단',
          type: 'cause', depth: 1,
          summary: '내부 문서, 고객 데이터, 영업 비밀을 외부 AI API 서버로 전송하는 것은 대부분 기업의 보안 정책을 위반한다. 삼성전자는 2023년 직원이 ChatGPT에 소스코드를 입력한 사건 이후 사내 AI 사용을 전면 제한했다. 이후 국내 대기업 68%가 유사 정책을 도입했으며, 직원들은 개인 계정으로 우회하는 "숨바꼭질"이 벌어지고 있다.',
          sources: [
            { label: 'TechCrunch — Samsung bans ChatGPT after data leak (2023)', url: 'https://techcrunch.com/2023/05/02/samsung-bans-use-of-generative-ai-tools-like-chatgpt-after-april-internal-data-leak/' },
            { label: 'KISA — ChatGPT 보안 위협과 시사점', url: 'https://www.kisa.or.kr/post/fileDownload?menuSeq=20301&postSeq=18&attachSeq=1&lang_type=KO' },
            { label: 'NCSC — 생성형 AI 활용 보안 가이드라인 (2023)', url: 'https://www.ncsc.go.kr:4018/main/cop/bbs/selectBoardArticle.do?bbsId=InstructionGuide_main&nttId=54340&pageIndex=1' },
          ],
        },
        {
          id: 'n3', headline: '프로덕션 오류율 기준 0.1% vs 현재 LLM 3~5%',
          source: 'MIT', date: '03.2026', dataPoint: '법무·의료·금융 현장 적용 기준',
          type: 'cause', depth: 1,
          summary: '현재 최고 성능 LLM의 실제 업무 오류율은 3~5% 수준이다. 그런데 법무팀의 AI 계약서 검토 도입 요건은 0.1% 이하, 의료 진단 지원은 0.01% 이하, 금융 사기 탐지는 0.001% 이하다. 이 10~1,000배의 간격을 좁히는 것이 현재 AI 연구의 핵심 과제지만, 해결에는 수년이 걸릴 전망이다.',
          sources: [
            { label: 'MIT Technology Review — The problem with AI hallucinations', url: 'https://www.technologyreview.com/2023/04/03/1070893/how-do-you-know-when-to-trust-ai/' },
            { label: 'McKinsey — The state of AI (2025)', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
          ],
        },
        // depth 2 — 핵심 신호
        {
          id: 'n4', headline: 'AI 프로젝트 88%가 PoC 단계에서 멈춘다',
          source: 'IDC / McKinsey', date: '04.2026', dataPoint: 'PoC 6주 → 프로덕션 18개월',
          type: 'center', depth: 2,
          summary: 'IDC 조사에서 AI 파일럿의 88%가 프로덕션 단계에 도달하지 못했다. (33개 AI PoC 중 4개만 배포 성공) 실패 원인 1위는 "기술 부족"(12%)이 아니라 "데이터 품질"(70%)이었다. 기업들은 AI 기술보다 자체 데이터 인프라가 준비되지 않았다는 사실을 PoC를 시작하고 나서야 알게 된다.',
          sources: [
            { label: 'CIO.com — 88% of AI Pilots Fail to Reach Production (IDC)', url: 'https://www.cio.com/article/3850763/88-of-ai-pilots-fail-to-reach-production-but-thats-not-all-on-it.html' },
            { label: 'McKinsey — The state of AI (2025)', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
            { label: 'McKinsey — The state of AI in early 2024', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2024' },
          ],
        },
        // depth 3 — 즉각 파급
        {
          id: 'n5', headline: '온프레미스 LLM 구축 시장 280% 폭등',
          source: 'IDC', date: '04.2026', dataPoint: 'GPU 서버 기업향 전환 가속',
          type: 'effect', depth: 3,
          summary: '데이터를 외부로 보낼 수 없다면, AI 모델을 내부로 가져오면 된다. 이 논리로 사내 서버에 LLM을 직접 구축하는 온프레미스 AI 수요가 폭발했다. IDC는 2026년 기업향 온프레미스 LLM 시장이 전년 대비 280% 성장했다고 발표했다. 엔비디아 GPU 서버, 네트워킹 장비, 전력·냉각 인프라 수요가 동반 급증 중이다.',
          sources: [
            { label: 'IDC — AI Infrastructure Market Forecast', url: 'https://www.idc.com/getdoc.jsp?containerId=prUS52758624' },
            { label: 'Fortune — Samsung bans employee use of ChatGPT', url: 'https://fortune.com/2023/05/02/samsung-bans-employee-use-chatgpt-data-leak/' },
          ],
        },
        {
          id: 'n6', headline: '"AI 도입 완료" 발표 vs 직원 62% "변화 없다"',
          source: '한경총', date: '03.2026', dataPoint: 'AI 워싱 기업 주가 조정 예고',
          type: 'effect', depth: 3,
          summary: '보도자료와 현실의 괴리가 심화되고 있다. 국내 대기업 IR 자료에서 "AI 도입 완료", "AI 전략 본격화"라는 표현이 2배 증가했지만, 실제 직원 설문에서 62%는 "업무에 AI가 실질적으로 활용되지 않는다"고 응답했다. 이 괴리가 지속되면 AI 관련 기업 발표의 신뢰도 하락과 주가 조정으로 이어질 가능성이 높다.',
          sources: [
            { label: 'HBR — AI Success Depends on Tackling "Process Debt"', url: 'https://hbr.org/2024/06/ai-success-depends-on-tackling-process-debt' },
            { label: 'McKinsey — The state of AI (2025)', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
          ],
        },
        {
          id: 'n7', headline: '데이터 파이프라인 스타트업 시장이 새로 열린다',
          source: '업계', date: '04.2026', dataPoint: '관련 스타트업 투자 전년비 340%',
          type: 'effect', depth: 3,
          summary: 'PoC 실패 원인이 명확해지면서, 그 원인을 해결해주는 서비스 시장이 열리고 있다. 비구조화 데이터를 AI 학습 가능한 형태로 변환하는 데이터 파이프라인 스타트업들이 주목받는다. 2026년 이 분야 스타트업 투자는 전년 대비 340% 증가했다. "왜 AI가 작동 안 하는지 진단"해주는 컨설팅 서비스도 새로운 카테고리로 성장 중이다.',
          sources: [
            { label: 'CIO.com — 88% of AI Pilots Fail to Reach Production', url: 'https://www.cio.com/article/3850763/88-of-ai-pilots-fail-to-reach-production-but-thats-not-all-on-it.html' },
            { label: 'HBR — AI Success Depends on Tackling "Process Debt"', url: 'https://hbr.org/2024/06/ai-success-depends-on-tackling-process-debt' },
          ],
        },
        // depth 4 — 구조 변화
        {
          id: 'n8', headline: 'AI 네이티브 기업이 레거시 대기업을 이기기 시작한다',
          source: 'HBR', date: '04.2026', dataPoint: '데이터 부채 없는 신생기업의 구조적 우위',
          type: 'effect', depth: 4,
          summary: '레거시 데이터 인프라가 없는 AI 네이티브 기업들은 이 문제에서 자유롭다. 설립 초기부터 데이터를 AI 친화적인 형태로 구조화해왔기 때문이다. 이는 시장 진입 3~5년차 스타트업이 30년 역사의 대기업보다 AI 적용 속도에서 앞서는 역설적 상황을 만들고 있다.',
          sources: [
            { label: 'HBR — When Every Company Can Use the Same AI Models, Context Becomes a Competitive Advantage', url: 'https://hbr.org/2026/02/when-every-company-can-use-the-same-ai-models-context-becomes-a-competitive-advantage' },
            { label: 'HBR — AI Success Depends on Tackling "Process Debt"', url: 'https://hbr.org/2024/06/ai-success-depends-on-tackling-process-debt' },
          ],
        },
        {
          id: 'n9', headline: 'AI 못 하는 기업은 빅테크 클라우드에 종속된다',
          source: '업계', date: '04.2026', dataPoint: 'Azure·AWS AI 구독 B2B 점유율 +45%',
          type: 'effect', depth: 4,
          summary: '온프레미스 AI 구축이 어려운 중소·중견기업들은 Microsoft Azure, Amazon AWS, Google Cloud의 AI 구독 서비스로 빠르게 흡수되고 있다. 이들 플랫폼의 B2B AI 구독 점유율은 전년 대비 45% 증가했다. 한번 특정 클라우드 AI 생태계에 종속되면, 데이터와 모델을 이전하는 비용이 너무 커 벗어나기 어렵다.',
          sources: [
            { label: 'McKinsey — The state of AI (2025)', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
            { label: 'HBR — When Every Company Can Use the Same AI Models', url: 'https://hbr.org/2026/02/when-every-company-can-use-the-same-ai-models-context-becomes-a-competitive-advantage' },
          ],
        },
      ],
      edges: [
        { from: 'rn1', to: 'n1', label: '레거시 → 데이터 정제 불가' },
        { from: 'rn1', to: 'n2', label: '레거시 → 보안정책 경직' },
        { from: 'rn2', to: 'n2', label: '책임 공백 → 과잉 방어' },
        { from: 'rn2', to: 'n3', label: '책임 공백 → 기준 과도' },
        { from: 'n1',  to: 'n4', label: '데이터 정제 불가' },
        { from: 'n2',  to: 'n4', label: '보안 장벽' },
        { from: 'n3',  to: 'n4', label: '정확도 기준 미달' },
        { from: 'n4',  to: 'n5', label: '우회 전략' },
        { from: 'n4',  to: 'n6', label: '신뢰 균열' },
        { from: 'n4',  to: 'n7', label: '새 시장 창출' },
        { from: 'n5',  to: 'n8', label: '자체 인프라 → 네이티브 가속' },
        { from: 'n6',  to: 'n8', label: 'AI 워싱 쇠퇴 → 진짜 AI 부각' },
        { from: 'n7',  to: 'n8', label: '파이프라인 해결 → 장벽 제거' },
        { from: 'n5',  to: 'n9', label: '온프레미스 못 하면 종속' },
        { from: 'n6',  to: 'n9', label: 'AI 못 하는 기업 탈락' },
      ],
      guides: [
        {
          id: 'economics', label: '경제학 렌즈', position: 'top',
          focusNodeIds: ['n4', 'rn1', 'rn2'],
          markerCoord: { lat: 30, lng: 0 },
          questions: [],
          interpretation: '88%의 PoC 실패는 시장 실패(market failure)의 전형적 패턴을 따른다. AI 컨설팅과 기술 벤더들은 프로젝트 개시 단계에서 수익을 얻으므로, 성공보다 시작 자체에 인센티브가 설계되어 있다. 데이터 정제 비용은 외부 효과(externality)로 처리되어 ROI 계산에서 빠진다. 결과적으로 기업은 실패를 예측하면서도 합리적으로 PoC를 시작한다. 이 인센티브 구조가 바뀌지 않으면, AI 도입률이 올라가도 성공률은 변하지 않는다.',
        },
        {
          id: 'psychology', label: '조직심리학 렌즈', position: 'right',
          focusNodeIds: ['n2', 'n6', 'rn2'],
          markerCoord: { lat: 0, lng: 90 },
          questions: [],
          interpretation: '중간 관리자의 AI 도입 저항은 비합리적이지 않다. AI가 자신의 판단권을 대체하거나 자신의 팀을 축소시킬 수 있다는 인식은 충분히 합리적인 자기보호다. "도입 완료"를 선언하는 임원과 "변화 없다"고 느끼는 직원의 인지 분리는 조직 내 권력 불균형의 신호다. 데이터·보안 문제는 순수한 기술적 장벽이기도 하지만, 조직이 변화를 거부할 때 꺼내드는 합리화 도구가 되기도 한다.',
        },
        {
          id: 'history', label: '기술역사학 렌즈', position: 'bottom',
          focusNodeIds: ['n4', 'n8', 'rn1'],
          markerCoord: { lat: -30, lng: 180 },
          questions: [],
          interpretation: '1990년대 ERP 도입 실패율은 70%, 2000년대 인터넷 전환 실패율은 60-80%였다. AI PoC의 88%는 이상한 숫자가 아니다. 변환 기술(transformative technology)은 항상 같은 궤적을 그린다 — 과도한 기대, 대규모 도입 시도, 높은 실패율, 소수의 성공 기업 등장, 점진적 표준화. 지금 AI는 그 사이클의 두 번째 단계에 있다. 역사적으로 전환에 성공한 기업들의 공통점은 기술이 아니라 데이터 거버넌스 구조를 먼저 정비한 것이었다.',
        },
        {
          id: 'philosophy', label: '철학적 렌즈', position: 'left',
          focusNodeIds: ['n4', 'n6'],
          markerCoord: { lat: 0, lng: 270 },
          questions: [],
          interpretation: '"AI 도입"을 목표로 삼는 것 자체가 이미 하나의 전제를 포함한다 — AI는 도구이고, 기업은 그것을 사용하면 된다는 전제. 그러나 PoC가 작동하지 않는 이유를 보면, 문제는 도구가 아니라 어떤 질문에 답하려는지 불명확하다는 데 있다. 기업들은 AI에게 해결해달라는 문제를 정확히 언어화하지 못한 채 PoC를 시작한다. AI 실패의 본질은 기술 실패가 아니라, 문제 정의의 실패다.',
        },
      ],
    },
  },
  kw107: {
    keywordId: 'kw107',
    news: [
      {
        title: '통계청, 2025년 합계출산율 0.72명 확정 발표',
        summary: 'OECD 38개국 중 최하위. 인구학자들은 "인구 소멸 구조에 진입했다"고 경고. 정부는 인구국가비상사태를 선언했으나 실효성 의문.',
        source: '통계청',
        date: '2026.02.26',
        url: '#',
      },
      {
        title: '30대 자가보유율 43%, 주거 불안이 결혼 포기를 만든다',
        summary: '20~39세 미혼 남녀 33%가 "결혼 못 하는 이유 1위는 주거비용"이라고 응답. 서울 평균 아파트 가격은 12.4억원으로 중위소득 가구 기준 43년치 저축 필요.',
        source: '주택금융공사',
        date: '2026.03.12',
        url: '#',
      },
    ],
    timeline: { firstSeen: '02.26', peakDate: '03.15' },
    relatedSignals: [
      { id: 'kw108', label: '집값이 결혼을 막는 구조', isWeak: false },
      { id: 'kw109', label: '65세가 5명 중 1명이 됐다', isWeak: false },
      { id: 'kw132', label: '출산율 OECD 꼴찌, 몇 년째인가', isWeak: true },
    ],
    causalGraph: {
      nodes: [
        { id: 'n1', headline: '서울 아파트 중위가격 12.4억, 43년치 저축', source: '주택금융공사', date: '03.2026', dataPoint: '30대 자가보유율 43%', type: 'cause', depth: 0 },
        { id: 'n2', headline: '자녀 사교육비 월평균 67만원, OECD 1위', source: '통계청', date: '03.2026', dataPoint: '월 양육비 총액 170만원', type: 'cause', depth: 0 },
        { id: 'n3', headline: '합계출산율 0.72명 공식 확정', source: '통계청', date: '02.2026', dataPoint: 'OECD 38개국 중 최하위', type: 'center', depth: 1 },
        { id: 'n4', headline: '생산가능인구 2040년 현재의 72%로 급감', source: 'KDI', date: '03.2026', dataPoint: '2030년부터 연 50만명 감소', type: 'effect', depth: 2 },
        { id: 'n5', headline: '국민연금 고갈 시점 2050년으로 앞당겨져', source: '국민연금공단', date: '02.2026', dataPoint: '당초 2056년에서 6년 앞당김', type: 'effect', depth: 2 },
        { id: 'n6', headline: '?', type: 'open', depth: 3 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: '결혼·출산 포기' },
        { from: 'n2', to: 'n3', label: '양육 부담' },
        { from: 'n3', to: 'n4', label: '노동력 감소' },
        { from: 'n3', to: 'n5', label: '재정 압박' },
        { from: 'n4', to: 'n6' },
        { from: 'n5', to: 'n6' },
      ],
    },
  },
  kw125: {
    keywordId: 'kw125',
    news: [
      {
        title: '한미 관세 협상 타결, 상호관세율 15%로 확정',
        summary: '초기 25% 위협에서 15%로 낮아졌으나, 자동차·철강 분야는 별도 협상 진행 중. 반도체·의약품은 최혜국 대우 유지. 90일 유예 기간 후 즉시 적용.',
        source: 'USTR / 산업부',
        date: '2026.04.28',
        url: '#',
      },
      {
        title: '현대기아차, 미국 공장 생산 확대 전략으로 선회',
        summary: '조지아 공장 생산량 50% 증설 결정. 한국 공장 수출 물량은 그만큼 감소. 국내 일자리 2,300개 영향 추정. "관세 회피가 아닌 현지화 전략"이라고 설명.',
        source: '현대자동차',
        date: '2026.04.15',
        url: '#',
      },
    ],
    timeline: { firstSeen: '04.01', peakDate: '04.28' },
    relatedSignals: [
      { id: 'kw101', label: '성장률 1%대가 뉴노멀이 됐다', isWeak: false },
      { id: 'kw102', label: '원화 1,450원의 경고', isWeak: false },
      { id: 'kw128', label: 'AI 칩 수요가 관세 충격을 덮는다', isWeak: true },
    ],
    causalGraph: {
      nodes: [
        { id: 'n1', headline: '대미 무역흑자 연 440억달러, 6위 타깃', source: 'USTR', date: '03.2026', dataPoint: '상호관세 부과 명분 확보', type: 'cause', depth: 0 },
        { id: 'n2', headline: '트럼프 "상호주의 원칙" 25% 관세 예고', source: 'WH', date: '04.2026', dataPoint: '90일 유예 후 적용 위협', type: 'cause', depth: 0 },
        { id: 'n3', headline: '한미 협상 타결, 상호관세 15% 확정', source: 'USTR·산업부', date: '04.2026', dataPoint: '자동차 15%, 반도체 MFN', type: 'center', depth: 1 },
        { id: 'n4', headline: '현대기아 미국 공장 50% 증설 결정', source: '현대자동차', date: '04.2026', dataPoint: '국내 생산 물량 이동 시작', type: 'effect', depth: 2 },
        { id: 'n5', headline: '대미 수출 4.9% 감소, 연간 260억달러 타격', source: '한국무역협회', date: '04.2026', dataPoint: '수출 중소기업 48% 영향권', type: 'effect', depth: 2 },
        { id: 'n6', headline: '?', type: 'open', depth: 3 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: '압박 근거' },
        { from: 'n2', to: 'n3', label: '협상 트리거' },
        { from: 'n3', to: 'n4', label: '공장 현지화' },
        { from: 'n3', to: 'n5', label: '수출 타격' },
        { from: 'n4', to: 'n6' },
        { from: 'n5', to: 'n6' },
      ],
    },
  },
  kw119: {
    keywordId: 'kw119',
    news: [
      {
        title: 'AI 에이전트, 처음으로 사람 없이 업무 계약 완료',
        summary: 'Anthropic의 Claude가 법무 검토, 계약서 작성, 서명까지 단독으로 처리한 사례 공개. 기업들이 "에이전트 도입률"을 KPI로 설정하기 시작. 한국 대기업 70%가 올해 도입 계획 확정.',
        source: 'McKinsey Korea',
        date: '2026.04.22',
        url: '#',
      },
      {
        title: 'AI 에이전트 도입 기업, 사무직 채용 30% 줄인다',
        summary: '에이전트가 반복 업무 60%를 자동화하면서 신규 채용보다 기존 인력 재교육으로 전환. "AI 역량" 없는 이력서는 서류 통과율 절반 이하로 하락.',
        source: '한국경영자총협회',
        date: '2026.03.30',
        url: '#',
      },
    ],
    timeline: { firstSeen: '03.15', peakDate: '04.22' },
    relatedSignals: [
      { id: 'kw120', label: 'HBM이 AI 전쟁의 진짜 병목', isWeak: false },
      { id: 'kw123', label: '오픈소스 AI, GPT를 따라잡은 순간', isWeak: false },
      { id: 'kw121', label: 'AI 프로젝트 90%가 PoC에 멈춘다', isWeak: true },
    ],
    causalGraph: {
      nodes: [
        { id: 'n1', headline: '오픈소스 LLM 성능 GPT-4 수준, API 비용 -90%', source: '업계', date: '03.2026', dataPoint: '모델 운영비 월 500달러 이하', type: 'cause', depth: 0 },
        { id: 'n2', headline: 'MCP 에이전트 표준 채택, 도구 연동 급확산', source: 'Anthropic', date: '04.2026', dataPoint: '기업용 커넥터 3,000개 출시', type: 'cause', depth: 0 },
        { id: 'n3', headline: 'AI 에이전트, 처음으로 법무·재무 업무 단독 처리', source: 'McKinsey Korea', date: '04.2026', dataPoint: '대기업 70% 도입 확정', type: 'center', depth: 1 },
        { id: 'n4', headline: '화이트칼라 직무 재설계 가속, 채용 30% 감소', source: '한경총', date: '03.2026', dataPoint: 'AI 역량 명시 채용공고 3배 증가', type: 'effect', depth: 2 },
        { id: 'n5', headline: 'SaaS 구독 해지 급증, AI 에이전트로 대체', source: 'IITP', date: '04.2026', dataPoint: '엔터프라이즈 SaaS 이탈률 +22%', type: 'effect', depth: 2 },
        { id: 'n6', headline: '?', type: 'open', depth: 3 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: '비용 장벽 소멸' },
        { from: 'n2', to: 'n3', label: '도구 표준화' },
        { from: 'n3', to: 'n4', label: '노동 구조 변화' },
        { from: 'n3', to: 'n5', label: '시장 대체' },
        { from: 'n4', to: 'n6' },
        { from: 'n5', to: 'n6' },
      ],
    },
  },
  kw120: {
    keywordId: 'kw120',
    news: [
      {
        title: 'SK하이닉스, NVIDIA HBM3E 2026년 물량 전량 완판 — 영업이익 47조 역대 최대',
        summary: 'SK하이닉스 CFO 공식 확인: "2026년 전체 HBM 물량이 이미 완판됐다." NVIDIA Blackwell 가속기 HBM3E 62%를 단독 공급하며 2025년 영업이익 47조원(전년 대비 2배) 달성. HBM3E 12단 양산을 업계 최초로 시작한 18개월의 기술 선점이 삼성·마이크론을 압도한 구조적 결과다.',
        source: 'SK하이닉스 / TrendForce',
        date: '2025.12.24',
        url: 'https://www.trendforce.com/news/2025/12/24/news-samsung-sk-hynix-reportedly-plan-20-hbm3e-price-hike-for-2026-as-nvidia-h200-asic-demand-rises/',
      },
      {
        title: '미국, 사상 최초 HBM 중국 수출 통제 — 화웨이 AI 칩 HBM 재고 2025년 말 소진 위기',
        summary: '2024년 12월 HBM에 대한 국가 단위 수출 통제 전격 도입. 화웨이 Ascend 910C 생산에 필요한 HBM 비축분이 2025년 말 소진 예상. 중국 자체 CXMT의 HBM 연간 생산량(200만 스택)은 화웨이 수요의 극히 일부. "HBM 봉쇄 = AI 가속기 봉쇄"라는 새로운 방정식이 성립됐다.',
        source: 'SemiAnalysis / The Decoder',
        date: '2025.01.15',
        url: 'https://the-decoder.com/huaweis-ai-chip-production-boom-reportedly-faces-a-critical-shortage-of-high-bandwidth-memory/',
      },
    ],
    timeline: { firstSeen: '04.02', peakDate: '04.22' },
    relatedSignals: [
      { id: 'kw103', label: '삼성, TSMC에 뒤처지는 증거', isWeak: false },
      { id: 'kw127', label: '중국 반도체 굴기가 성공하면', isWeak: false },
      { id: 'kw131', label: '메모리 반도체 1위, 언제까지', isWeak: true },
    ],
    causalGraph: {
      nodes: [
        // depth 0 — 구조적 원인
        {
          id: 'rn1',
          headline: 'AI 모델 파라미터 100배 급증 — GPU가 처리할 데이터 양이 물리 한계에 닿다',
          source: 'NVIDIA / Anthropic', date: '03.2026',
          dataPoint: 'GPT-1 → GPT-4: 파라미터 1만배, 필요 대역폭 50배',
          type: 'cause', depth: 0,
          summary: '2018년 GPT-1은 1.17억 파라미터였다. GPT-4는 추정 1조 파라미터다. 이 파라미터 전체가 GPU 연산 시 메모리에서 실시간으로 불러와져야 한다. GPU 연산 코어가 아무리 빨라도, 메모리에서 데이터를 가져오는 속도가 따라주지 않으면 코어는 빈 상태로 대기한다. 이것이 "메모리 장벽(memory wall)"이다. AI 모델이 커질수록 이 장벽이 더 높아지고, HBM만이 유일한 해법이 된다.',
          sources: [
            { label: 'NVIDIA H200 공식 스펙 — 메모리 대역폭 4.8 TB/s', url: 'https://www.nvidia.com/en-us/data-center/h200/' },
            { label: 'Wevolver — HBM Architecture: Deep Dive into 3D Stacking', url: 'https://www.wevolver.com/article/what-is-hbm-high-bandwidth-memory-deep-dive-into-architecture-packaging-and-applications' },
          ],
        },
        {
          id: 'rn2',
          headline: 'HBM 제조는 세계에서 가장 어려운 반도체 공정 — 10개 만들면 4~5개가 불량이다',
          source: 'Applied Materials / 업계', date: '03.2026',
          dataPoint: '12단 TSV 적층, 수율 50~60%, DDR 대비 웨이퍼 3~4배 소모',
          type: 'cause', depth: 0,
          summary: 'HBM은 30~50μm(종이 두께 1/3) 두께로 얇게 연마한 DRAM 다이 12장을 수직으로 쌓고, 수천 개의 구리 기둥(TSV)으로 관통 연결하는 공정이다. 한 층이라도 불량이면 전체가 폐기된다. 현재 업계 수율은 50~60% 수준이다. 이것이 "지금 당장 증산을 결정해도 2년이 걸리는" 물리적 이유다. 일반 DDR DRAM 대비 같은 용량 생산에 웨이퍼가 3~4배 더 필요하다.',
          sources: [
            { label: 'Vik\'s Newsletter — Why is HBM so Hard to Manufacture', url: 'https://www.viksnewsletter.com/p/why-is-hbm-so-hard-to-manufacture' },
            { label: 'Applied Materials — HBM Materials Innovation Propels AI Forward', url: 'https://www.appliedmaterials.com/us/en/newsroom/perspectives/hbm--materials-innovation-propels-high-bandwidth-memory-into-the.html' },
          ],
        },
        // depth 1 — 직접 원인
        {
          id: 'n1',
          headline: 'H200 GPU 한 장에 HBM3e 141GB 탑재 — DDR로는 물리적으로 대체 불가능',
          source: 'NVIDIA', date: '04.2026',
          dataPoint: 'HBM3e 대역폭 4.8 TB/s vs GDDR6 800 GB/s — 6배 차이',
          type: 'cause', depth: 1,
          summary: 'NVIDIA H200에는 HBM3e 141GB가 탑재되며 초당 4.8테라바이트의 데이터를 처리한다. 일반 GDDR6 메모리의 대역폭은 800GB/s — 6배 차이다. GDDR은 PCB 위에 2D로 배치되어 구조적 한계가 있다. HBM은 GPU 다이 바로 옆에 3D로 쌓아 인터포저로 연결하므로 데이터 이동 거리 자체가 다르다. B200에는 180GB HBM3e, 대역폭 7.7TB/s가 탑재된다. HBM은 AI GPU의 선택 사항이 아니라 전제조건이다.',
          sources: [
            { label: 'NVIDIA H200 공식 스펙 — 141GB HBM3e, 4.8 TB/s', url: 'https://www.nvidia.com/en-us/data-center/h200/' },
            { label: 'Introl — H100 vs H200 vs B200: 상세 비교', url: 'https://introl.com/blog/h100-vs-h200-vs-b200-choosing-the-right-nvidia-gpus-for-your-ai-workload' },
          ],
        },
        {
          id: 'n2',
          headline: 'OpenAI Stargate 단독 수요가 글로벌 HBM 생산량의 2.5배 — 공급은 최소 2년 뒤',
          source: 'Tom\'s Hardware / AICerts', date: '04.2026',
          dataPoint: '글로벌 월 생산 35만 장 vs Stargate 필요 90만 장, SK하이닉스 2026년 완판',
          type: 'cause', depth: 1,
          summary: '2026년 기준 전 세계 HBM 월간 웨이퍼 생산량은 약 35만 장이다. OpenAI Stargate 프로젝트 단독 필요량은 90만 장 — 전 세계 생산량의 2.5배다. SK하이닉스는 2026년 물량을 이미 완판했다고 공식 발표했다. 신규 팹을 착공해도 풀가동까지 최소 2~3년이 걸린다. "지금 두 개의 반도체 공장을 착공해도 이 프로젝트 하나를 충당할 수 없다"는 계산이 나오는 구조다.',
          sources: [
            { label: 'Tom\'s Hardware — AI-driven HBM shortage could last until 2027', url: 'https://www.tomshardware.com/tech-industry/artificial-intelligence/samsung-and-sk-hynix-warn-ai-driven-memory-shortages-could-last-until-2027-and-beyond-as-hbm-demand-explodes-customers-already-reserving-supply-years-ahead-while-the-wider-dram-market-begins-to-tighten' },
            { label: 'AICerts — HBM Supply Crunch: Why AI Memory Shortage Lasts Until 2027', url: 'https://www.aicerts.ai/news/hbm-supply-crunch-why-ai-memory-shortage-lasts-until-2027/' },
          ],
        },
        {
          id: 'n3',
          headline: '미국, 2024년 12월 HBM 중국 수출 통제 — AI 칩 봉쇄의 마지막 퍼즐',
          source: 'Congress.gov / CFR', date: '12.2024',
          dataPoint: '화웨이 HBM 비축 1,170만 스택 → 2025년 말 소진 (SemiAnalysis)',
          type: 'cause', depth: 1,
          summary: '바이든 행정부는 2024년 12월, 사상 최초로 HBM에 대한 국가 단위 수출 통제를 도입했다. 이전까지 NVIDIA GPU는 막았지만 HBM은 규제 사각지대였다. 화웨이는 규제 전 삼성으로부터 700만 유닛의 HBM을 비축했으나, SemiAnalysis 분석에 따르면 이 재고는 2025년 말 소진된다. 중국 자체 CXMT의 HBM 연간 생산량은 200만 스택 — 화웨이 수요의 극히 일부에 불과하다.',
          sources: [
            { label: 'CFR — China\'s AI Chip Deficit: Why Huawei Can\'t Catch Nvidia', url: 'https://www.cfr.org/articles/chinas-ai-chip-deficit-why-huawei-cant-catch-nvidia-and-us-export-controls-should-remain' },
            { label: 'The Decoder — Huawei\'s AI chip boom faces critical HBM shortage', url: 'https://the-decoder.com/huaweis-ai-chip-production-boom-reportedly-faces-a-critical-shortage-of-high-bandwidth-memory/' },
          ],
        },
        // depth 2 — 핵심 신호
        {
          id: 'n4',
          headline: 'HBM이 AI 전쟁의 진짜 병목 — 누가 HBM을 쥐느냐가 AI 패권을 결정한다',
          source: 'TrendForce / SK하이닉스', date: '04.2026',
          dataPoint: 'HBM 공급사 전 세계 3곳, 2026년 전량 선예약 완료',
          type: 'center', depth: 2,
          summary: 'AI 모델은 빠르게 발전하고, GPU는 생산할 수 있고, 소프트웨어는 오픈소스로 풀렸다. 그런데 이 모든 것을 작동시키는 HBM이 물리적으로 부족하다. HBM 없이 H200도, B200도 만들 수 없다. 전 세계에 HBM을 공급할 수 있는 기업은 단 3곳(SK하이닉스, 삼성, 마이크론)뿐이다. 이 물리적 병목이 글로벌 AI 인프라 확장 속도 전체를 결정하고 있다.',
          sources: [
            { label: 'TrendForce — AI to consume 20% of global DRAM wafer capacity in 2026', url: 'https://www.trendforce.com/news/2025/12/26/news-ai-reportedly-to-consume-20-of-global-dram-wafer-capacity-in-2026-hbm-gddr7-lead-demand/' },
            { label: 'SK Hynix — 2026 Market Outlook: HBM-led Memory Supercycle', url: 'https://news.skhynix.co.kr/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/' },
            { label: 'Notebookcheck — SK Hynix sells out HBM supply to NVIDIA through 2026', url: 'https://www.notebookcheck.net/SK-hynix-sells-out-its-DRAM-NAND-and-HBM-chip-supply-to-Nvidia-through-2026-as-AI-demand-outpaces-Samsung-and-Micron-s-capacity.1151402.0.html' },
          ],
        },
        // depth 3 — 즉각 파급
        {
          id: 'n5',
          headline: 'SK하이닉스 NVIDIA 점유율 62% vs 삼성 17% — 수율 격차가 시장을 갈랐다',
          source: 'TrendForce / KED Global', date: '04.2026',
          dataPoint: '삼성 점유율 42% (2024) → 17% (2025), NVIDIA 자격심사 18개월 탈락',
          type: 'effect', depth: 3,
          summary: '2024년 초, SK하이닉스와 삼성은 HBM 시장에서 52.5:42.4의 비율로 경쟁했다. 2025년, 이 비율은 62:17로 벌어졌다. 삼성의 HBM3E 12단 제품이 NVIDIA 열 안정성 검증을 통과하지 못하며 18개월간 주요 공급에서 배제됐다. 삼성이 NVIDIA 자격심사를 통과한 것은 2025년 9월이었다. 그 사이 SK하이닉스와 마이크론이 시장을 선점했다. HBM 수율에서 18개월 뒤처진 것이 시장점유율 25%포인트 손실로 직결됐다.',
          sources: [
            { label: 'KED Global — Samsung passes Nvidia HBM3E qualification', url: 'https://www.kedglobal.com/korean-chipmakers/newsView/ked202509190008' },
            { label: 'Digitimes — Samsung HBM4 Nvidia supply negotiations for 2026', url: 'https://www.digitimes.com/news/a20251216PD218/hbm4-samsung-nvidia-2026-sk-hynix.html' },
          ],
        },
        {
          id: 'n6',
          headline: 'AI 데이터센터 GPU 대기 6~12개월 — AI 스타트업 훈련비용 3~5배 폭등',
          source: 'Clarifai / Tom\'s Hardware', date: '04.2026',
          dataPoint: 'H100 피크 리드타임 최대 11개월, 클라우드 GPU 2차 시장가 5배',
          type: 'effect', depth: 3,
          summary: '2023년 H100 GPU 리드타임은 최대 11개월이었다. HBM 공급 부족이 GPU 생산을 직접 제한했기 때문이다. AWS, Azure, GCP가 1순위로 GPU를 가져가고, AI 스타트업들은 2차 시장에서 3~5배 비싼 가격을 지불한다. 풍부한 컴퓨팅 자원을 가진 빅테크와 스타트업 사이의 격차가 HBM 병목에 의해 더 벌어지고 있다. 컴퓨팅이 AI 민주화의 병목이 된 핵심 원인이 여기 있다.',
          sources: [
            { label: 'Clarifai — GPU Shortages in 2026: What\'s Happening and Why', url: 'https://www.clarifai.com/blog/gpu-shortages-2026' },
            { label: 'Tom\'s Hardware — Nvidia\'s H100 AI GPU shortages ease as lead times drop', url: 'https://www.tomshardware.com/pc-components/gpus/nvidias-h100-ai-gpu-shortages-ease-as-lead-times-drop-from-up-to-four-months-to-8-12-weeks' },
          ],
        },
        {
          id: 'n7',
          headline: 'HBM이 DRAM 웨이퍼 20% 잠식 — AI 불황은 없어도 PC·스마트폰 D램값은 오른다',
          source: 'TrendForce / Tom\'s Hardware', date: '04.2026',
          dataPoint: 'HBM이 2026년 전체 DRAM 웨이퍼 용량 20% 소비, PC 메모리 공급 감소',
          type: 'effect', depth: 3,
          summary: '반도체 팹은 HBM과 일반 DDR5를 같은 웨이퍼로 만든다. HBM 수요가 늘면 일반 D램에 쓰일 웨이퍼가 줄어든다. TrendForce에 따르면 2026년 HBM이 전체 DRAM 웨이퍼 용량의 20%를 잠식할 전망이다. 이것이 PC 메모리(DDR5)와 스마트폰 메모리(LPDDR5X) 공급 감소로 이어지고, 일반 소비자가 쓰는 기기 가격까지 연쇄 상승시키는 구조다. AI 붐의 비용을 소비자가 간접적으로 분담하는 형태다.',
          sources: [
            { label: 'TrendForce — AI to consume 20% of global DRAM wafer capacity in 2026', url: 'https://www.trendforce.com/news/2025/12/26/news-ai-reportedly-to-consume-20-of-global-dram-wafer-capacity-in-2026-hbm-gddr7-lead-demand/' },
            { label: 'Tom\'s Hardware — HBM is eating your PC\'s RAM', url: 'https://www.tomshardware.com/pc-components/ram/hbm-is-eating-your-ram' },
          ],
        },
        // depth 4 — 구조 변화
        {
          id: 'n8',
          headline: 'SK하이닉스 영업이익 47조, 전년 2배 — 삼성이 이길 수 있는가라는 질문이 생겼다',
          source: 'SK하이닉스 실적 발표', date: '01.2026',
          dataPoint: '2025년 매출 97조, 영업이익 47조 역대 최대, HBM 영업이익 기여 50%+',
          type: 'effect', depth: 4,
          summary: 'SK하이닉스의 2025년 영업이익은 47조원, 전년 대비 2배다. HBM3E 가격은 GB당 $20~100로 일반 DDR5($10 미만) 대비 2~10배 프리미엄이다. HBM이 전체 D램 출하량의 20%대에 불과하지만 영업이익의 50% 이상을 창출한다. 반면 삼성전자 반도체 부문은 상대적 부진을 겪으며, "30년 동안 없었던 질문" — 삼성이 SK하이닉스를 이길 수 있는가 — 가 처음으로 진지하게 거론되기 시작했다.',
          sources: [
            { label: 'SK Hynix — 2025 Annual Business Results (영업이익 47조 발표)', url: 'https://news.skhynix.co.kr/2025-business-results/' },
            { label: '뉴탐사 — SK하이닉스 47조의 비밀', url: 'https://newtamsa.org/news/s7RkUo' },
          ],
        },
        {
          id: 'n9',
          headline: '중국 AI 굴기의 진짜 한계 — 로직 칩은 만들어도 HBM 없으면 AI 가속기 완성 불가',
          source: 'SemiAnalysis / CFR', date: '04.2026',
          dataPoint: 'CXMT 자체 HBM 연 200만 스택 vs 화웨이 Ascend 수요 수십 배',
          type: 'effect', depth: 4,
          summary: '화웨이는 수출 통제 전 약 1,170만 유닛의 HBM 스택을 비축했다. 이 재고가 2025년 말 소진된다. 중국 내 유일한 대안 CXMT의 연간 HBM 생산 능력은 200만 스택으로, Ascend 910C 약 25~30만 개 생산분에 불과하다. 설령 중국이 7nm 로직 칩을 자력으로 만들어도 HBM 없이는 고성능 AI 가속기가 완성되지 않는다. HBM이 반도체 수출 통제의 최종 방어선이 된 이유다.',
          sources: [
            { label: 'SemiAnalysis — Huawei Ascend Production Ramp & HBM Bottleneck', url: 'https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp' },
            { label: 'CFR — China\'s AI Chip Deficit: Why Huawei Can\'t Catch Nvidia', url: 'https://www.cfr.org/articles/chinas-ai-chip-deficit-why-huawei-cant-catch-nvidia-and-us-export-controls-should-remain' },
          ],
        },
      ],
      edges: [
        { from: 'rn1', to: 'n1', label: 'AI 대형화 → 대역폭 폭증' },
        { from: 'rn1', to: 'n2', label: '수요 > 전 세계 생산 능력' },
        { from: 'rn2', to: 'n2', label: '공정 난이도 → 증산 불가' },
        { from: 'rn2', to: 'n3', label: '제조 기술 = 지정학 무기' },
        { from: 'n1',  to: 'n4', label: 'DDR 물리적 대체 불가' },
        { from: 'n2',  to: 'n4', label: '공급 확대 구조적 한계' },
        { from: 'n3',  to: 'n4', label: '지정학 병목 추가' },
        { from: 'n4',  to: 'n5', label: '수율 전쟁 승패 결정' },
        { from: 'n4',  to: 'n6', label: 'GPU 공급 직접 제한' },
        { from: 'n4',  to: 'n7', label: 'DRAM 웨이퍼 용량 잠식' },
        { from: 'n5',  to: 'n8', label: '독점 공급 → 초과 이익' },
        { from: 'n6',  to: 'n8', label: '반도체 산업 역학 재편' },
        { from: 'n5',  to: 'n9', label: '수출 통제 효과 현실화' },
        { from: 'n7',  to: 'n9', label: '전방위 반도체 공급 타격' },
      ],
      guides: [
        {
          id: 'economics', label: '경제학 렌즈', position: 'top',
          focusNodeIds: ['n4', 'n5', 'n8'],
          markerCoord: { lat: 30, lng: 0 },
          questions: [],
          interpretation: 'HBM 시장은 교과서적 과점(oligopoly) 구조다. 전 세계에 3개 기업만이 공급할 수 있고, 수요는 단기간에 폭발했으며, 신규 진입자는 최소 5년 이상의 기술·자본 장벽에 막혀 있다. SK하이닉스가 NVIDIA 물량의 62%를 독점하며 GB당 최대 $100의 프리미엄을 받는 것은 시장 지배가 아닌 수율 기술의 결과다. 그러나 이 구조가 영속적이지 않다는 것도 경제학이 예측한다. 삼성의 기술 회복, 마이크론의 추격, 중국의 자체 개발이 교란 요인으로 대기 중이다. 지금 SK하이닉스의 47조 영업이익은 "수율 선점"이라는 타이밍 우위가 만든 시한부 프리미엄이다. 그 윈도우는 2~3년이다.',
        },
        {
          id: 'geopolitics', label: '지정학 렌즈', position: 'right',
          focusNodeIds: ['n3', 'n9', 'rn2'],
          markerCoord: { lat: 0, lng: 90 },
          questions: [],
          interpretation: '미국이 HBM 수출을 통제하기로 결정했을 때, 그것은 단순한 메모리 규제가 아니었다. HBM이 없으면 AI 가속기 자체가 완성되지 않는다는 사실을 활용한 공급망 봉쇄였다. 화웨이가 7nm 칩을 자력으로 만들어도, HBM 없이는 고성능 AI 서버를 조립할 수 없다. 이것이 반도체 수출 통제의 진화된 형태다 — 핵심 부품 하나를 장악하면 완성품 생산 전체를 막을 수 있다. 한국은 이 구도에서 HBM 공급망의 핵심에 있으며, 그 위치가 전략적 레버리지와 취약성을 동시에 부여한다. 한국의 반도체 기업이 미·중 패권 경쟁의 핵심 변수가 된 이유다.',
        },
        {
          id: 'history', label: '기술역사학 렌즈', position: 'bottom',
          focusNodeIds: ['n4', 'rn2', 'n5'],
          markerCoord: { lat: -30, lng: 180 },
          questions: [],
          interpretation: '반도체 역사에서 공정 전환기마다 주도권이 바뀌었다. 1980년대 메모리 반도체는 일본이 지배했다. 한국 삼성·현대가 1990년대 초 모험적 투자로 일본을 추월했다. 2010년대 3D NAND 공정 전환에서 삼성이 앞서며 격차를 벌렸다. 지금 HBM3E 12단 적층에서 SK하이닉스가 삼성을 앞선 것도 같은 패턴이다. 전환 기술에서 18개월 앞선 것이 시장점유율 25%포인트 차이로 바뀌었다. 역사의 교훈은 하나다: 공정 전환 타이밍을 놓친 기업은 추격하는 데 두 배의 시간과 비용이 든다.',
        },
        {
          id: 'philosophy', label: '전략적 렌즈', position: 'left',
          focusNodeIds: ['n4', 'n6', 'n9'],
          markerCoord: { lat: 0, lng: 270 },
          questions: [],
          interpretation: '"병목을 통제하는 자가 전체 흐름을 지배한다." AI 가속기를 만드는 데 수십 개의 부품이 필요하지만, 그 중 HBM 하나가 병목이 되면 나머지 모든 부품의 생산 능력은 의미를 잃는다. 이것은 전략이론의 "핵심 노드 통제"가 현실에서 작동하는 방식이다. AI 전쟁의 진짜 경쟁은 알고리즘도, GPU 설계도 아닐 수 있다. 12단 실리콘 적층에서 54%의 수율이냐 61%의 수율이냐가 산업 전체의 승패를 가른다. 물리 세계의 공정 기술이 디지털 패권의 진짜 결정자라는 역설이 여기 있다.',
        },
      ],
    },
  },
  kw001: {
    keywordId: 'kw001',
    news: [
      {
        title: '보건복지부, 의료 AI 인허가 절차 대폭 간소화',
        summary: '기존 3단계 인허가 절차를 1단계로 축소. 의료기기 소프트웨어 등록 기간 평균 18개월에서 3개월로 단축 예정.',
        source: '보건복지부',
        date: '2025.04.25',
        url: '#',
      },
      {
        title: '국내 의료 AI 스타트업, 이달 투자 유치 러시',
        summary: '규제 완화 발표 이후 3일간 시리즈A 이상 투자 공시 5건. 총 투자금 320억원. 전월 동기 대비 4배.',
        source: 'DART 공시',
        date: '2025.04.24',
        url: '#',
      },
    ],
    timeline: { firstSeen: '04.23', peakDate: '04.25' },
    relatedSignals: [
      { id: 'kw002', label: '헬스케어 투자 급증', isWeak: false },
      { id: 'kw003', label: '원격진료 입법 동향', isWeak: false },
      { id: 'kw005', label: '일본 의료법 개정', isWeak: true },
    ],
    dimensions: [
      {
        id: 'economy', label: '경제', icon: '₩',
        nodes: [
          { label: '헬스케어 투자 빙하기', type: 'cause', dataPoint: 'VC 투자 -43% (2023)' },
          { label: '의료 AI 규제 완화', type: 'center', dataPoint: '인허가 18개월 → 3개월' },
          { label: '스타트업 투자 러시', type: 'effect', dataPoint: '3일간 320억 유치' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'regulation', label: '규제', icon: '⚖',
        nodes: [
          { label: '일본 의료법 개정 선례', type: 'cause', dataPoint: '2024.11 시행' },
          { label: '의료 AI 규제 완화', type: 'center', dataPoint: '3단계 → 1단계' },
          { label: '원격진료 입법 압력', type: 'effect', dataPoint: '국회 발의안 3건' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'technology', label: '기술', icon: '◈',
        nodes: [
          { label: 'AI 진단 정확도 임계점', type: 'cause', dataPoint: '의사 수준 95% 달성' },
          { label: '의료 AI 규제 완화', type: 'center', dataPoint: 'FDA 승인 모델 47개' },
          { label: '의료 데이터 개방 가속', type: 'effect', dataPoint: 'PHR 법안 2Q 예정' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'social', label: '사회', icon: '人',
        nodes: [
          { label: '초고령사회 공식 진입', type: 'cause', dataPoint: '65세+ 인구 20.6%' },
          { label: '의료 AI 규제 완화', type: 'center', dataPoint: '의료 접근성 불평등 심화' },
          { label: '지방 의료 공백 해소 압력', type: 'effect', dataPoint: '무의촌 23% 증가' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'timing', label: '타이밍', icon: '◷',
        nodes: [
          { label: '3가지 조건 동시 충족', type: 'cause', dataPoint: '기술·규제·수요 수렴' },
          { label: '의료 AI 규제 완화', type: 'center', dataPoint: '창이 열린 시점' },
          { label: '6~18개월 선점 윈도우', type: 'effect', dataPoint: '후발주자 진입 전' },
          { label: '???', type: 'open' },
        ],
      },
    ],
    causalGraph: {
      nodes: [
        { id: 'n1', headline: '통계청, 초고령사회 공식 진입 발표', source: '통계청', date: '04.25', dataPoint: '65세+ 20.6%', type: 'cause', depth: 0 },
        { id: 'n2', headline: '일본 의료기기법 개정 시행', source: '해외선례', date: '04.23', dataPoint: '18개월→3개월 선례', type: 'cause', depth: 0 },
        { id: 'n3', headline: '보건복지부 의료AI 인허가 절차 간소화', source: '보건복지부', date: '04.25', dataPoint: '3단계 → 1단계', type: 'center', depth: 1 },
        { id: 'n4', headline: '의료AI 스타트업 3일간 320억 유치', source: 'DART', date: '04.24', dataPoint: '전월 동기 대비 4배', type: 'effect', depth: 2 },
        { id: 'n5', headline: '원격진료 입법안 3건 동시 발의', source: '국회', date: '04.25', dataPoint: '여야 동시 추진', type: 'effect', depth: 2 },
        { id: 'n6', headline: '?', type: 'open', depth: 3 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: '수요 압력' },
        { from: 'n2', to: 'n3', label: '규제 선례' },
        { from: 'n3', to: 'n4', label: '즉각 반응' },
        { from: 'n3', to: 'n5', label: '후속 입법' },
        { from: 'n4', to: 'n6' },
        { from: 'n5', to: 'n6' },
      ],
    },
  },
  kw004: {
    keywordId: 'kw004',
    news: [
      {
        title: '통계청, 2025년 초고령사회 공식 진입 발표',
        summary: '65세 이상 인구 비율 20.6% 기록. OECD 최단 기간 초고령사회 진입. 요양·헬스케어 수요 급증 전망.',
        source: '통계청',
        date: '2025.04.25',
        url: '#',
      },
      {
        title: '요양보험 지출, 올해 처음 20조원 돌파 예상',
        summary: '노인 장기요양 신청자 전년 대비 12% 증가. 공공 인프라 부족으로 민간 요양 시장 확대 국면.',
        source: '건강보험공단',
        date: '2025.04.23',
        url: '#',
      },
    ],
    timeline: { firstSeen: '04.20', peakDate: '04.25' },
    relatedSignals: [
      { id: 'kw002', label: '헬스케어 투자 급증', isWeak: false },
      { id: 'kw006', label: '요양 인프라 부족', isWeak: false },
      { id: 'kw001', label: '의료 AI 규제 완화', isWeak: true },
    ],
    dimensions: [
      {
        id: 'economy', label: '경제', icon: '₩',
        nodes: [
          { label: '요양보험 재정 한계', type: 'cause', dataPoint: '지출 20조 돌파 (2025)' },
          { label: '고령화 초고령사회', type: 'center', dataPoint: '65세+ 20.6% 공식 진입' },
          { label: '민간 요양시장 폭발', type: 'effect', dataPoint: '시장 규모 +12% YoY' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'regulation', label: '규제', icon: '⚖',
        nodes: [
          { label: '장기요양보험법 한계', type: 'cause', dataPoint: '1등급 수급자 대기 8개월' },
          { label: '고령화 초고령사회', type: 'center', dataPoint: 'OECD 최단 기간 진입' },
          { label: '요양시설 규제 완화 논의', type: 'effect', dataPoint: '민간 시설 설립 요건 완화' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'technology', label: '기술', icon: '◈',
        nodes: [
          { label: '돌봄 인력 구조적 부족', type: 'cause', dataPoint: '요양보호사 이직률 38%' },
          { label: '고령화 초고령사회', type: 'center', dataPoint: '독거노인 238만명 (2025)' },
          { label: '케어봇·원격모니터링 수요', type: 'effect', dataPoint: '관련 특허 전년비 2.4배' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'social', label: '사회', icon: '人',
        nodes: [
          { label: '베이비붐 세대 은퇴 완료', type: 'cause', dataPoint: '1958~63년생 전원 65세+' },
          { label: '고령화 초고령사회', type: 'center', dataPoint: '1인 노인가구 35%' },
          { label: '간병 부담 사회문제화', type: 'effect', dataPoint: '간병 이유 퇴직 연 14만명' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'timing', label: '타이밍', icon: '◷',
        nodes: [
          { label: '인구절벽 + 의료비 폭증', type: 'cause', dataPoint: '2가지 압력 동시 임계점' },
          { label: '고령화 초고령사회', type: 'center', dataPoint: '10년 내 돌이킬 수 없는 구조' },
          { label: '지금이 인프라 선점 시점', type: 'effect', dataPoint: '공급 절대 부족 5~10년' },
          { label: '???', type: 'open' },
        ],
      },
    ],
    causalGraph: {
      nodes: [
        { id: 'n1', headline: '베이비붐 세대 전원 65세 이상 진입', source: '통계청', date: '04.20', dataPoint: '1958~63년생 완료', type: 'cause', depth: 0 },
        { id: 'n2', headline: '요양보험 지출 20조원 첫 돌파', source: '건강보험공단', date: '04.23', dataPoint: '신청자 전년비 +12%', type: 'cause', depth: 0 },
        { id: 'n3', headline: '한국 초고령사회 공식 진입 선언', source: '통계청', date: '04.25', dataPoint: 'OECD 최단 기간 진입', type: 'center', depth: 1 },
        { id: 'n4', headline: '민간 요양시장 확대 본격화', source: '업계', date: '04.24', dataPoint: '공급 절대 부족 국면', type: 'effect', depth: 2 },
        { id: 'n5', headline: '케어봇·원격모니터링 특허 급증', source: '특허청', date: '04.24', dataPoint: '전년비 2.4배', type: 'effect', depth: 2 },
        { id: 'n6', headline: '?', type: 'open', depth: 3 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: '인구 구조 변화' },
        { from: 'n2', to: 'n3', label: '재정 임계점' },
        { from: 'n3', to: 'n4', label: '수요 폭발' },
        { from: 'n3', to: 'n5', label: '기술 수요' },
        { from: 'n4', to: 'n6' },
        { from: 'n5', to: 'n6' },
      ],
    },
  },
  kw007: {
    keywordId: 'kw007',
    news: [
      {
        title: '국내 대기업 70%, 올해 LLM 도입 계획 확정',
        summary: '삼성·LG·SK 등 주요 대기업 생성AI 도입률 전년 대비 3배. 비용 절감보다 프로세스 자동화에 초점.',
        source: 'McKinsey Korea',
        date: '2025.04.24',
        url: '#',
      },
      {
        title: 'B2B SaaS → AI 에이전트 전환 가속',
        summary: '기존 SaaS 기업들의 AI 에이전트 기능 탑재 경쟁. 구독료 인상 없이 기능 고도화로 고객 이탈 방지 전략.',
        source: '정보통신기획평가원',
        date: '2025.04.23',
        url: '#',
      },
    ],
    timeline: { firstSeen: '04.18', peakDate: '04.24' },
    relatedSignals: [
      { id: 'kw009', label: 'AI 에이전트 시장 개화', isWeak: false },
      { id: 'kw008', label: 'SaaS 구독 피로 현상', isWeak: false },
      { id: 'kw011', label: '오픈소스 LLM 부상', isWeak: true },
    ],
    dimensions: [
      {
        id: 'economy', label: '경제', icon: '₩',
        nodes: [
          { label: 'ChatGPT 충격 후 관망기 종료', type: 'cause', dataPoint: 'ROI 검증 사례 누적' },
          { label: 'LLM 기업 도입 급증', type: 'center', dataPoint: '대기업 70% 도입 확정' },
          { label: 'IT 예산 AI로 재편', type: 'effect', dataPoint: 'SW 예산 中 AI 비중 34%' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'regulation', label: '규제', icon: '⚖',
        nodes: [
          { label: 'EU AI Act 시행 압력', type: 'cause', dataPoint: '2025.08 전면 적용' },
          { label: 'LLM 기업 도입 급증', type: 'center', dataPoint: '생성AI 규제 논의 가속' },
          { label: '기업 AI 거버넌스 의무화', type: 'effect', dataPoint: '금융·의료 먼저 적용' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'technology', label: '기술', icon: '◈',
        nodes: [
          { label: '오픈소스 LLM 품질 임계점', type: 'cause', dataPoint: 'Llama3 GPT-4 수준 도달' },
          { label: 'LLM 기업 도입 급증', type: 'center', dataPoint: 'B2B SaaS → AI 에이전트 전환' },
          { label: '내부 업무 자동화 폭발', type: 'effect', dataPoint: '반복업무 자동화율 목표 60%' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'social', label: '사회', icon: '人',
        nodes: [
          { label: 'MZ 세대 AI 네이티브 입사', type: 'cause', dataPoint: '신입 85% 일상적 AI 사용' },
          { label: 'LLM 기업 도입 급증', type: 'center', dataPoint: '도입 안 하면 인재 이탈 우려' },
          { label: 'AI 역량 채용 기준 부상', type: 'effect', dataPoint: '채용공고 AI 역량 명시 3배' },
          { label: '???', type: 'open' },
        ],
      },
      {
        id: 'timing', label: '타이밍', icon: '◷',
        nodes: [
          { label: '기술 성숙 + 비용 하락 교차점', type: 'cause', dataPoint: 'API 비용 18개월 전 대비 -90%' },
          { label: 'LLM 기업 도입 급증', type: 'center', dataPoint: '지금이 격차 벌어지는 시점' },
          { label: '선도기업 2년 격차 형성 중', type: 'effect', dataPoint: '도입 완료 기업 생산성 +32%' },
          { label: '???', type: 'open' },
        ],
      },
    ],
    causalGraph: {
      nodes: [
        { id: 'n1', headline: '오픈소스 LLM 성능 GPT-4 수준 도달', source: '업계', date: '04.18', dataPoint: 'API 비용 -90% (18개월)', type: 'cause', depth: 0 },
        { id: 'n2', headline: '국내 대기업 70% LLM 도입 계획 확정', source: 'McKinsey Korea', date: '04.24', dataPoint: '전년 대비 3배 증가', type: 'center', depth: 1 },
        { id: 'n3', headline: 'B2B SaaS→AI 에이전트 전환 가속', source: 'IITP', date: '04.23', dataPoint: '구독료 인상 없이 기능 고도화', type: 'effect', depth: 2 },
        { id: 'n4', headline: 'AI 역량 채용 기준으로 급부상', source: '업계', date: '04.24', dataPoint: '채용공고 AI 명시 3배 증가', type: 'effect', depth: 2 },
        { id: 'n5', headline: '?', type: 'open', depth: 3 },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '비용 장벽 소멸' },
        { from: 'n2', to: 'n3', label: '솔루션 재편' },
        { from: 'n2', to: 'n4', label: '조직 변화' },
        { from: 'n3', to: 'n5' },
        { from: 'n4', to: 'n5' },
      ],
    },
  },
}

export function getDimensionLayers(keyword: KeywordNode): DimensionLayer[] {
  const detail = SIGNAL_DETAILS[keyword.id]
  if (detail?.dimensions) return detail.dimensions

  return [
    {
      id: 'economy', label: '경제', icon: '₩',
      nodes: [
        { label: '시장 구조 변화', type: 'cause' },
        { label: keyword.label, type: 'center' },
        { label: '투자·비용 재편', type: 'effect' },
        { label: '???', type: 'open' },
      ],
    },
    {
      id: 'regulation', label: '규제', icon: '⚖',
      nodes: [
        { label: '기존 규제 한계', type: 'cause' },
        { label: keyword.label, type: 'center' },
        { label: '정책 변화 압력', type: 'effect' },
        { label: '???', type: 'open' },
      ],
    },
    {
      id: 'technology', label: '기술', icon: '◈',
      nodes: [
        { label: '기술 성숙도 임계점', type: 'cause' },
        { label: keyword.label, type: 'center' },
        { label: '신규 솔루션 등장', type: 'effect' },
        { label: '???', type: 'open' },
      ],
    },
    {
      id: 'social', label: '사회', icon: '人',
      nodes: [
        { label: '행동 패턴 변화', type: 'cause' },
        { label: keyword.label, type: 'center' },
        { label: '수요 구조 전환', type: 'effect' },
        { label: '???', type: 'open' },
      ],
    },
    {
      id: 'timing', label: '타이밍', icon: '◷',
      nodes: [
        { label: '복수 조건 수렴', type: 'cause' },
        { label: keyword.label, type: 'center' },
        { label: '선점 윈도우 개방', type: 'effect' },
        { label: '???', type: 'open' },
      ],
    },
  ]
}

export function getPersonalizedKeywords(
  domains: string[],
  _role: string
): { primary: KeywordNode[]; crossDomain: KeywordNode[] } {
  const primaryPool = domains.flatMap(d => KEYWORDS_BY_DOMAIN[d] ?? [])
  const primaryUnique = Array.from(new Map(primaryPool.map(k => [k.id, k])).values())
  const primary = primaryUnique.sort((a, b) => b.strength - a.strength).slice(0, 5)

  const primaryIds = new Set(primary.map(k => k.id))
  const crossPool = ALL_KEYWORDS.filter(k => !primaryIds.has(k.id) && !domains.some(d => k.domain.includes(d)))
  const crossDomain = crossPool.sort((a, b) => b.strength - a.strength).slice(0, 3)

  return { primary, crossDomain }
}

export function getSignalDetail(keyword: KeywordNode): SignalDetail {
  if (SIGNAL_DETAILS[keyword.id]) return SIGNAL_DETAILS[keyword.id]

  return {
    keywordId: keyword.id,
    news: [
      {
        title: `${keyword.label} 관련 최신 동향`,
        summary: '이 신호와 관련된 최근 주요 뉴스와 데이터를 수집·분석 중입니다.',
        source: '시그널 분석팀',
        date: '2025.04.25',
        url: '#',
      },
    ],
    timeline: { firstSeen: '04.21', peakDate: '04.25' },
    relatedSignals: keyword.connectedTo.map(id => {
      const kw = ALL_KEYWORDS.find(k => k.id === id)
      return { id, label: kw?.label ?? id, isWeak: (kw?.strength ?? 0) < 0.5 }
    }),
  }
}
