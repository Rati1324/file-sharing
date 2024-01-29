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

async function getData(tableName: string, keyword: string = "") {
  const token: string | null = sessionStorage.getItem('access_token');
  const searchKeyword = keyword.length ? `?search=${keyword}` : "";

  const files = await fetch(`http://127.0.0.1:8000/get_${tableName}${searchKeyword}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  const filesJson = await files.json();
  return filesJson;
}

async function deleteFiles(fileIds: number[]) {
  const token: string | null = sessionStorage.getItem('access_token');
  const res = await fetch(`http://127.0.01:8000/delete_files`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(fileIds)
  })
  return res.status;
}

export { uploadFile, verifyToken, getData, deleteFiles };