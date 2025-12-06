import { mockFeedbacks } from 'mocks/member';
import { useState } from 'react';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-2">피드백 관리</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-4 py-3 border-b">일련번호</th>
              <th className="px-4 py-3 border-b">아이디</th>
              <th className="px-4 py-3 border-b">이름</th>
              <th className="px-4 py-3 border-b">종목</th>
              <th className="px-4 py-3 border-b">평점</th>
              <th className="px-4 py-3 border-b">삭제</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map((f, index) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{f.email}</td>
                <td className="px-4 py-3">{f.name}</td>
                <td className="px-4 py-3">{f.activity}</td>
                <td className="px-4 py-3">{f.rating}</td>
                <td className="px-4 py-3">
                  <button
                    className="text-emerald-600 hover:underline"
                    onClick={() => handleDelete(f.id)}
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
