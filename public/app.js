// Grab the articles as a json
$.getJSON("/articles", function(data) {
    console.log(data)
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
      $("#articles").append(
    `<div class="panel panel-info">        
        <div class="panel-heading">
            <a href='http://www.theonion.com${data[i].link}'>    
                <h3 class="panel-title" data-id='${data[i]._id}'>${data[i].title}</h3>
            </a>
        </div>
        <div class="panel-body">
            ${data[i].description};
            <button class="btn btn-sm pull-right" type="submit">Comment</button>
        </div>
    </div>`);
    }
  });

  
