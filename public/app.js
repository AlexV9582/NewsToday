// Grab the articles as a json
$.getJSON("/articles", function(data) {
    console.log(data)
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page with a modal for comments
      $("#articles").append(
    `<div class="panel panel-info" "data-id"=${data[i]._id}>        
        <div class="panel-heading">
            <a href='http://www.theonion.com${data[i].link}'>    
                <h3 class="panel-title" data-id='${data[i]._id}'>${data[i].title}</h3>
            </a>
        </div>
        <div class="panel-body">
            ${data[i].description};
            <button class="btn btn-sm pull-right" data-toggle="modal" data-target="#myModal" type="submit">Comment</button>
        </div>
    </div>
    <!-- Modal -->
    <div id="myModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
    
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">${data[i].title}</h4>
            </div>
            <div class="modal-body">
            <form class="form-inline">
                <div class="form-group">
                    <label class="sr-only" for="inputEmail">Email address</label>
                    <input type="email" class="form-control" id="inputEmail" placeholder="Email">
                </div>
                <div class="form-group">
                    <label class="sr-only" for="inputPassword">Password</label>
                    <input type="password" class="form-control" id="inputPassword" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-default" id="submit">Sign in and submit</button>
            </form>
            <br>
            <div>
                <textarea class="form-control" rows="3" placeholder="Comments" id="comments"></textarea>
            </div>
            <br>
            <p>${data[i].description}</p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    
        </div>
    </div>`);
    }
  });

$("#submit").on("click", function() {
    event.preventDefault();
    var userInfo = {
        username: $("#inputEmail").val(),
        password: $("#inputPassword").val()
    };
    console.log(userInfo);
    $.post("/users", userInfo, function(data) {
        console.log("User info sent")
    })


})
