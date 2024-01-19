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

async function getFiles(keyword: string = "") {
  const token: string | null = sessionStorage.getItem('access_token');
  const searchKeyword = keyword.length ? `?search=${keyword}` : "";

  const files = await fetch(`http://127.0.0.1:8000/get_files${searchKeyword}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  const filesJson = await files.json();
  return filesJson;
}

async function deleteFiles(fileIds: number[], setFiles: (files: any) => void) {
  const token: string | null = sessionStorage.getItem('access_token');
  console.log("hi")
  try {
    const res = await fetch(`http://127.0.01:8000/delete_files`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(fileIds)
    })
    if (res.status === 200) {
      const files = await getFiles();
      setFiles(files.result);
      return res.status
      // toast({
      //   title: 'Deleted successfully', status: 'success',
      //   duration: 2000, isClosable: true,
      // })
    }
    else if (res.status === 401) {
      // navigate("/signin")
      // toast({
      //   title: 'Unauthorized request.', status: 'error',
      //   duration: 2000, isClosable: true,
      // })
    }
  }
  catch (error: any) {
    // toast({
    //   title: 'Unknown error has occured', status: 'error',
    //   duration: 2000, isClosable: true,
    // })
  }
}

export { uploadFile, verifyToken, getFiles, deleteFiles };