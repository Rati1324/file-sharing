async function uploadFile(file: File): Promise<Response | undefined> {
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
      return response

    } catch (error) {
      console.error('There was a problem with the fetch operation: ', error);
    }
};


async function verifyToken(token: string | null): Promise<Response | undefined> {
  const res = await fetch("http://localhost:8000/verify_token/", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  return res;
}

export { uploadFile, verifyToken };