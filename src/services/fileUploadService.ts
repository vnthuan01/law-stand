// import { apiClient } from '@/lib/apiClients';

// export interface FileUploadResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: {
//     url: string;
//     fileName: string;
//     fileSize: number;
//   };
// }

// export const fileUploadService = {
//   // Upload avatar image
//   uploadAvatar: (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     return apiClient.post<FileUploadResponse>('/upload/avatar', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },

//   // Upload general file
//   uploadFile: (file: File, folder: string = 'general') => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('folder', folder);

//     return apiClient.post<FileUploadResponse>('/upload/file', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },
// };
