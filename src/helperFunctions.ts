
export async function uploadFile(file: File) {
    const formData = new FormData();
    const token:string = sessionStorage.getItem('access_token');
    if (token == null) {
      // alert("You are not a")
      throw new Error("You are not authorized");
    }

    formData.append('file', file);
    formData.append('token', token);

    try {
      const response = await fetch('http://127.0.0.1:8000/uploadfile', {
        method: 'POST',
        body: formData,
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