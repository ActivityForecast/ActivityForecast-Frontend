import { useState } from 'react';
import Button from 'components/Button';
import { ReactComponent as CautionIcon } from 'assets/icons/caution.svg';
import { ReactComponent as QuestionIcon } from 'assets/icons/question.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/heart.svg';
import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg';
import WithdrawModal from './WithdrawModal';
import ActivitySelectModal from 'components/ActivitySelectModal';
import activities from 'constants/activities';

export default function Option() {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openPrefModal, setOpenPrefModal] = useState(false);

  const [prefSelected, setPrefSelected] = useState({
    유산소: [],
    구기스포츠: [],
    익스트림스포츠: [],
    피트니스: [],
  });

  const handlePrefClick = () => {
    setOpenPrefModal(true);
  };

  const handleHelpClick = () => {
    alert('도움말 화면으로 이동 예정');
  };

  const handleLeaveClick = () => {
    setOpenWithdraw(true);
  };

  const handleLogout = () => {
    alert('로그아웃 요청 예정');
  };

  const handleConfirmWithdraw = () => {
    setOpenWithdraw(false);
    alert('회원탈퇴 플로우 예정');
  };

  const handleConfirmPref = (payload) => {
    setPrefSelected(payload); // 추가: API에서 기존 값을 가져오거나 로컬스토리지에 저장해서 연동하는 방식 검토
    setOpenPrefModal(false);
    // 추가: API 호출로 선호 저장
  };

  return (
    <>
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5 text-lg font-semibold text-gray-900">
          설정
        </div>

        <button
          className="w-full flex items-center justify-between px-6 py-6 text-sm text-gray-800 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-200"
          onClick={handlePrefClick}
        >
          <div className="flex items-center gap-2">
            <HeartIcon className="w-6 h-6" />
            <span>선호 활동 설정</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>

        <button
          className="w-full flex items-center justify-between px-6 py-6 text-sm text-gray-800 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-200"
          onClick={handleHelpClick}
        >
          <div className="flex items-center gap-2">
            <QuestionIcon className="w-6 h-6 " />
            <span>도움말</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>

        <button
          className="w-full flex items-center justify-between px-6 py-6 text-sm text-red-500 hover:bg-gray-50 active:bg-gray-100"
          onClick={handleLeaveClick}
        >
          <div className="flex items-center gap-2">
            <CautionIcon className="w-6 h-6" />
            <span>회원탈퇴</span>
          </div>
          <span className="text-gray-400">{'>'}</span>
        </button>
      </section>

      <section className="w-full max-w-[840px] mt-8">
        <Button
          onClick={handleLogout}
          className="w-full rounded border border-red-400 bg-white text-red-500 text-sm py-3 flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100"
        >
          <LogoutIcon />
          <span className="text-[#ef4444]">로그아웃</span>
        </Button>
      </section>

      <WithdrawModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        onConfirm={handleConfirmWithdraw}
      />

      <ActivitySelectModal
       isOpen={openPrefModal}
       onClose={() => setOpenPrefModal(false)}
       onConfirm={handleConfirmPref}
       activities={activities}
      initialSelected={prefSelected}
    />
    </>
  );
}
