import Modal from 'components/Modal/Modal';

export default function HelpModal({ open, onClose }) {
  const faqs = [
    {
      q: '해당 웹 서비스의 목적이 무엇인가요?',
      a: '사용자의 개별 선호도와 실시간 환경 데이터를 융합하여, 추천 야외활동을 예측하고 추천하는 지능형 웹 서비스입니다.',
    },
    {
      q: '비가 오면 추천이 어떻게 바뀌나요?',
      a: '강수량이 임계값을 넘으면 실외 활동 가중치가 낮아지고, 실내 활동(피트니스 등) 가중치가 올라가게 됩니다.',
    },
    {
      q: '실내 활동만 보고 싶어요.',
      a: '선호 활동 설정에서 실내 위주의 카테고리를 더 많이 선택하면 사용자 취향에 반영이 되어 더 자주 등장할 수 있습니다.',
    },
    {
      q: '회원탈퇴는 어디서 하나요?',
      a: '마이페이지 화면 하단에서 “회원탈퇴” 메뉴로 진행할 수 있습니다. 탈퇴 시 개인화 데이터는 삭제됩니다.',
    },
  ];

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="도움말 (FAQ)"
      isCloseOutsideClick={true}
      position="top"
      containerStyle={{ width: '100%', maxWidth: 720 }}
    >
      <div className="max-h-[60vh] overflow-y-auto px-4 pb-2">
        <p className="text-sm text-gray-500 mt-6 mb-4">
          대표적인 질문을 모았습니다. 궁금한 항목을 눌러서 확인하세요.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100">
                {faq.q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-700 bg-white">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

    </Modal>
  );
}
