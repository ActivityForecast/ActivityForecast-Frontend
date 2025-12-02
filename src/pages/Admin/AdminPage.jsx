import { mockMembers } from 'mocks/member';
import { useState } from 'react';

export default function AdminMemberPage() {
  const [members, setMembers] = useState(mockMembers);

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleEdit = (id) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;

    const newName = window.prompt('이름을 수정하세요.', target.name);
    if (newName === null) return;

    const trimmed = newName.trim();
    if (!trimmed) {
      alert('이름은 비울 수 없습니다.');
      return;
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: trimmed } : m))
    );
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-6">회원 정보 관리</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-4 py-3 border-b">일련번호</th>
              <th className="px-4 py-3 border-b">이메일</th>
              <th className="px-4 py-3 border-b">이름</th>
              <th className="px-4 py-3 border-b">수정</th>
              <th className="px-4 py-3 border-b">삭제</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m, index) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{m.email}</td>
                <td className="px-4 py-3">{m.name}</td>

                <td className="px-4 py-3">
                  <button
                    className="text-emerald-600 hover:underline"
                    onClick={() => handleEdit(m.id)}
                  >
                    수정하기
                  </button>
                </td>

                <td className="px-4 py-3">
                  <button
                    className="text-emerald-600 hover:underline"
                    onClick={() => handleDelete(m.id)}
                  >
                    삭제하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
