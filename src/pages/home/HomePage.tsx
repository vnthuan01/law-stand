export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">About Us</h1>
        <p className="text-gray-700 mb-6">
          Đây là trang <span className="font-semibold">About</span>. Bạn có thể
          tùy chỉnh nội dung để giới thiệu về dự án, nhóm phát triển hoặc bất kỳ
          thông tin nào bạn muốn.
        </p>
        <button className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
