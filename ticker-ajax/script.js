(function () {
    var headlines = $("#container");
    var left;
    var id;

    function moveHeadlines() {
        left--;

        var links = $(".link");
        console.log(links);
        var width = links.eq(0).width();

        if (left + width == 0) {
            left += width;
            links[0].remove();
            headlines.append(links[0]);
        }

        headlines.css({ left: left + "px" });

        id = requestAnimationFrame(moveHeadlines);
    }

    $.ajax({
        url: "/data.json",
        method: "GET",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var link = document.createElement("a");
                link.classList.add("link");
                link.href = data[i].link;
                link.text = data[i].headline;
                headlines.append(link);
            }

            left = headlines.offset().left;

            headlines.on("mouseover", function () {
                cancelAnimationFrame(id);
            });

            headlines.on("mouseout", function () {
                id = requestAnimationFrame(moveHeadlines);
            });

            moveHeadlines();
        },
        error: function (err) {
            console.log("error:", err);
        },
    });
})();
