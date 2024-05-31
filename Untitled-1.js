
app.get('/doodapi', async (req, res) => {
    try {
      const apiKey = '396272eryk12p9b7hdsjkc';
      const response = await axios.get(`https://doodapi.com/api/upload/server?key=${apiKey}`);
      res.send(response.data); // Send the response data from DoodStream directly
    } catch (error) {
      console.error('Error fetching DoodStream files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Access the uploaded file through req.file
      const uploadedFile = req.file;
  
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('file', fs.createReadStream(uploadedFile.path));
  
      // Make a POST request to DoodStream upload endpoint
      const apiKey = '396272eryk12p9b7hdsjkc'; // Replace with your DoodStream API key
      const response = await axios.get(`https://doodapi.com/api/upload/server?key=${apiKey}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type header for FormData
          'X-Api-Key': apiKey
        }
      });
  
      // Send the DoodStream response back to the client
      res.json(response.data);
    } catch (error) {
      console.error('Error uploading file to DoodStream:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
