export async function uploadFile(file: File) {
    const formData = new FormData();
    const token: string | null = sessionStorage.getItem('access_token');
    if (token == null) {
      throw new Error("You are not authorized");
    }

    formData.append('file', file);
    try {
      const response = await fetch('http://127.0.0.1:8000/upload_file', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation: ', error);
    }
};