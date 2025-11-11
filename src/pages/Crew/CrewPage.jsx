import { useEffect, useState } from "react";
import Button from "components/Button";
import CalendarBox from "mocks/Calender";
import CrewListItem from "mocks/CrewListItem";
import Modal, { ModalFooter } from "components/Modal/Modal";
import InputField from "components/InputField";
import { useAuthStore } from 'stores/auth';

import { useCrewStore } from 'stores/crew';

export default function CrewPage() {
  const { user } = useAuthStore();
  const { myCrews, loadMyCrews, addCrew, removeMember } = useCrewStore();


  // 서버에서 크루 목록 로드
  useEffect(() => {
    if (user) {
      loadMyCrews();
    }
  }, [user, loadMyCrews]);

  // API 응답 필드가 달라도 안전하게 매핑
  const safeCrews = (myCrews || []).map((c) => ({
    id: c.crewId ?? c.id,
    name: c.crewName ?? c.name ?? '크루',
    current: c.activeMemberCount ?? (Array.isArray(c.members) ? c.members.length : 0) ?? 1,
    max: c.maxCapacity ?? c.max ?? 10,
    color: c.colorCode ?? c.color ?? "#83C8FC",
    inviteCode: c.inviteCode,
    members: Array.isArray(c.members) ? c.members : [],
  }));

  // 파스텔톤 색상 팔레트
  const colorPalette = [
    "#FC8385",
    "#FCA883",
    "#FCD083",
    "#A4E682",
    "#7FECC8",
    "#83C8FC",
    "#A6A4FC",
    "#E6A4FC",
    "#FC83C6",
    "#FCE683",
  ];

  // 랜덤 색상 선택
  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };

  //  생성 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crewName, setCrewName] = useState("");
  const [crewMax, setCrewMax] = useState("");

  //  탈퇴 완료 모달
  const [leaveTargetId, setLeaveTargetId] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  //  공유 모달
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async (crew) => {
    const code = crew.inviteCode;
    if (!code) return;
    const url = `${window.location.origin}/crew/join?code=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {}
    setShareUrl(url);
    setShareOpen(true);
  };

  // 예시 크루 일정 데이터
  const crewEvents = {
    1: [
      { date: "2025-11-04", label: "런닝" },
      { date: "2025-11-12", label: "축구" },
    ],
    2: [
      { date: "2025-11-07", label: "배구" },
      { date: "2025-11-20", label: "등산" },
    ],
  };

  // 크루 생성 로직
  const handleCreateCrew = async () => {
    if (!crewName.trim() || !crewMax.trim()) return;
    try {
      const cap = Math.max(1, Math.min(50, parseInt(crewMax, 10) || 1));
      const randomColor = getRandomColor();
      await addCrew({
        crewName: crewName,
        maxCapacity: cap,
        colorCode: randomColor,
      });
      setCrewName("");
      setCrewMax("");
      setIsModalOpen(false);
    } catch (error) {
      console.error('크루 생성 실패:', error);
    }
  };

  // CrewListItem에서 탈퇴 클릭 시 → 완료 모달 띄우기
  const handleLeaveRequest = (id) => {
    setLeaveTargetId(id);
    setLeaveModalOpen(true);
  };

  //  완료 클릭 시 실제 삭제
  const handleLeaveConfirm = async () => {
    if (leaveTargetId == null) return;
    const targetUserId = user?.userId ?? user?.id;
    if (!targetUserId) {
      // 사용자 ID를 확인할 수 없으면 일단 모달만 닫고 종료
      setLeaveTargetId(null);
      setLeaveModalOpen(false);
      return;
    }

    try {
      const success = await removeMember(leaveTargetId, targetUserId);
      if (success) {
        // 탈퇴 성공 시 목록 새로고침
        await loadMyCrews();
      }
    } catch (error) {
      console.error('크루 탈퇴 실패:', error);
    } finally {
      setLeaveTargetId(null);
      setLeaveModalOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative">
      <div
        className="
          w-[90vw] max-w-[952px]
          min-h-[90vh]
          border border-[rgba(0,0,0,0.09)]
          rounded-[30px]
          bg-[#F8FAFC]
          shadow-sm
          flex flex-col items-center
          justify-start
          pt-12 px-10 pb-10
          overflow-hidden
        "
      >
        {/*  상단 버튼 */}
        <div className="w-full flex justify-center">
          <Button
            type="button"
            styleType="solid"
            size="py-3.5 w-[200px] text-md"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[50px] shadow-md transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            크루 생성 +
          </Button>
        </div>

        {/* 크루 목록 */}
        <h2 className="w-full text-2xl font-semibold text-black mt-20 text-left ml-10 md:ml-20 lg:ml-40">
          크루목록
        </h2>

        <div className="w-full mt-4 px-6">
          {!user ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-14 px-6 text-center text-gray-400">
              <div className="text-base sm:text-lg">
                사용자가 참여하고 있는 크루가 없습니다
              </div>
              <div className="mt-2 text-xs sm:text-sm text-gray-400">
                크루를 생성하여 다른 사람과 함께 운동해요
              </div>
            </div>
          ) : (
            <div className="space-y-3">

              {safeCrews.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white py-14 px-6 text-center text-gray-400">
                  <div className="text-base sm:text-lg">
                    참여 중인 크루가 없습니다
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-gray-400">
                    크루를 생성하여 다른 사람과 함께 운동해요
                  </div>
                </div>
              ) : (
                safeCrews.map((c) => (
                  <CrewListItem
                    key={c.id}
                    id={c.id}
                    name={c.name}
                    current={c.current}
                    max={c.max}
                    color={c.color}
                    members={c.members}
                    events={crewEvents[c.id] || []}
                    onLeave={handleLeaveRequest}
                    onShare={() => handleShare(c)}
                  />
                ))
              )}

            </div>
          )}
        </div>

        {/* 캘린더 */}
        <h3 className="w-full text-2xl font-semibold text-black mt-10 text-center">
          캘린더
        </h3>
        <div className="mt-6 flex justify-center">
          {/* 이 캘린더만 X축 더 넓게 */}
          <CalendarBox inline size="xl" wide />
        </div>
      </div>

      {/* 모달 (크루 생성) - 가로폭 작게 */}
      <div style={{ '--modal-w-sm': '640px' }}>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="크루 생성하기"
      >
        <div className="flex flex-col gap-4 mt-4">
          <label className="font-semibold text-lg text-black">크루명</label>
          <InputField
            id="crewName"
            type="text"
            placeholder="크루명을 입력하세요"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
          />

          <label className="font-semibold text-lg text-black mt-2">인원</label>
          <InputField
            id="crewMax"
            type="number"
            placeholder="인원(최대 50)"
            min={1}
            max={50}
            value={crewMax}
            onChange={(e) => setCrewMax(e.target.value)}
          />

          <ModalFooter>
            <Button
              type="button"
              styleType="solid"
              onClick={handleCreateCrew}
              className="bg-[#3B82F6] text-white rounded-xl mt-4"
            >
              생성하기
            </Button>
          </ModalFooter>
        </div>
      </Modal>
      </div>

      {/*  탈퇴 완료 모달 - 더 작게 */}
      <div style={{ '--modal-w-sm': '520px' }}>
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        hasCloseButton={false}
        isCloseOutsideClick={true}
        title=""
      >
        <div className="text-center text-lg font-semibold py-6">
          탈퇴가 완료되었습니다
        </div>
        <ModalFooter>
          <button
            onClick={handleLeaveConfirm}
            className="flex-1 rounded-xl bg-[#4FBFF2] text-white py-3"
          >
            완료
          </button>
        </ModalFooter>
      </Modal>
      </div>

      {/* 공유 완료 모달 */}
      <div style={{ '--modal-w-sm': '520px' }}>
      <Modal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        hasCloseButton={false}
        isCloseOutsideClick={true}
        title=""
      >
        <div className="text-center py-6">
          <div className="text-lg font-semibold">공유를 위한 링크가 복사되었습니다!</div>
          <div className="mt-3 text-xs sm:text-sm text-gray-400 break-all">{shareUrl || 'http://…'}</div>
        </div>
        <ModalFooter>
          <button
            onClick={() => setShareOpen(false)}
            className="flex-1 rounded-xl bg-[#4FBFF2] text-white py-3"
          >
            완료
          </button>
        </ModalFooter>
      </Modal>
      </div>
    </main>
  );
}
