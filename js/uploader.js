function ekUpload(){
  function Init() {

    console.log("Upload Initialised");

    var fileSelect    = document.getElementById('file-upload'),
        fileDrag      = document.getElementById('file-drag'),
        submitButton  = document.getElementById('submit-button');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    // Is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      // File Drop
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  }

  function fileDragHover(e) {
    var fileDrag = document.getElementById('file-drag');

    e.stopPropagation();
    e.preventDefault();

    fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }

  function fileSelectHandler(e) {
    // Fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // Cancel event and hover styling
    fileDragHover(e);

    // Process all File objects
    for (var i = 0, f; f = files[i]; i++) {
        parseFile(f);
      
        //call the function below if you want to upload file to server
        //uploadFile(f);
    }
  }

  // Output
  function output(msg) {
    // Response
    var m = document.getElementById('messages');
    m.innerHTML = msg;
  }

  function parseFile(file) {

      console.log(file.name);
      output(
          '<strong>' + encodeURI(file.name) + '</strong>'
      );
    
      var fileType = file.type;
      console.log(fileType);
      var fileName = file.name;

      //check if file name is part of the acceptable types
      var isGood = (/\.(?=gif|jpg|png|jpeg|mov|mp4|wav|mp3|ogg)/gi).test(fileName);
      if (isGood) {
          //document.getElementById('start').classList.add("hidden");
          document.getElementById('response').classList.remove("hidden");
          //document.getElementById('notimage').classList.add("hidden");
          
          //check if file is an image
          var isImage = (/\.(?=gif|jpg|png|jpeg)/gi).test(fileName);
          if(isImage){
              // Thumbnail Preview
              document.getElementById('file-image').classList.remove("hidden");
              document.getElementById('file-image').src = URL.createObjectURL(file);
              
              document.getElementById('file-video').classList.add("hidden");
              document.getElementById('file-audio').classList.add("hidden");
          } else{
              //check if is video
              var isVideo = (/\.(?=mov|mp4)/gi).test(fileName);
              if(isVideo){
                  document.getElementById('file-video').classList.remove("hidden");
                  //document.getElementById('file-video-source').src = URL.createObjectURL(file);
                  var $source = $('#file-video-source');
                  $source[0].src = URL.createObjectURL(file);
                  $source.parent()[0].load();
                  
                  document.getElementById('file-image').classList.add("hidden");
                  document.getElementById('file-audio').classList.add("hidden");
              } else {
                  //check if is audio
                  var isAudio = (/\.(?=wav|mp3|ogg)/gi).test(fileName);
                  if(isAudio){
                      document.getElementById('file-audio').classList.remove("hidden");
                      var $source = $('#file-audio-source');
                      $source[0].src = URL.createObjectURL(file);
                      $source[0].type = fileType;
                      $source.parent()[0].load();
                      
                      document.getElementById('file-image').classList.add("hidden");
                      document.getElementById('file-video').classList.add("hidden");
                  }
              }
          }
      }
      else {
          document.getElementById('file-image').classList.add("hidden");
          document.getElementById('file-video').classList.add("hidden");
          document.getElementById('file-audio').classList.add("hidden");
          //document.getElementById('notimage').classList.remove("hidden");
          document.getElementById('start').classList.remove("hidden");
          document.getElementById('response').classList.add("hidden");
          document.getElementById("file-upload-form").reset();
      }
  }

  function setProgressMaxValue(e) {
    var pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.max = e.total;
    }
  }

  function updateFileProgress(e) {
    var pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.value = e.loaded;
    }
  }

  function uploadFile(file) {

    var xhr = new XMLHttpRequest(),
      fileInput = document.getElementById('class-roster-file'),
      pBar = document.getElementById('file-progress'),
      fileSizeLimit = 1024; // In MB
    if (xhr.upload) {
      // Check if file is less than x MB
      if (file.size <= fileSizeLimit * 1024 * 1024) {
        // Progress bar
        pBar.style.display = 'inline';
        xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
        xhr.upload.addEventListener('progress', updateFileProgress, false);

        // File received / failed
        xhr.onreadystatechange = function(e) {
          if (xhr.readyState == 4) {
            // Everything is good!

            // progress.className = (xhr.status == 200 ? "success" : "failure");
            // document.location.reload(true);
          }
        };

        // Start upload
        xhr.open('POST', document.getElementById('file-upload-form').action, true);
        xhr.setRequestHeader('X-File-Name', file.name);
        xhr.setRequestHeader('X-File-Size', file.size);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(file);
      } else {
        output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
      }
    }
  }

  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    document.getElementById('file-drag').style.display = 'none';
  }
}
ekUpload();