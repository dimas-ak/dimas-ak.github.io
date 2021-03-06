<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="arjunane.css?<?PHP echo rand() ?>">
    <link rel="stylesheet" type="text/css" href="Scripts/datatables.css?<?PHP echo rand() ?>">
    <title>Document</title>
</head>
<body>
    <div style="margin: 50px;" class="">
        <div class="eye">
            <div class="eye-inner">
                <div class="sharingan">
                    <div class="center">
                        <div class="commas"></div>
                        <div class="commas"></div>
                        <div class="commas"></div>
                    </div>
                </div>
                <div class="eyelid"></div>
            </div>
        </div>
    </div>
    <div class="mencoba"></div>
    <div style="margin-bottom:300%;"></div>
    <script type="text/javascript" src="jquery3.js"></script>
    <script type="text/javascript" src="Scripts/datatables.js?<?PHP echo rand() ?>"></script>
    <script type="text/javascript">
        $(".mencoba").table({
            //url: "http://localhost/pembayaran/main/ajax",
            json : "Scripts/json.json",
            checkable: true,
            action_checkable: 
            [
                {
                    cls     : "add",
                    url     : "http://localhost/pembayaran/main/changeDatas/",
                    text    : "TAMBAH BERITA",
                    params  : [0],
                    isRemove: true,
                    field   : 0,
                    msg     : "Do you really want to delete all of these?",
                    col_msg : "{i} = {m}"
                },
                {
                    cls     : "delete",
                    url     : "http://localhost/datatables/Scripts/delete.php/",
                    text    : "HAPUS",
                    params  : [0],
                    isRemove: true,
                    field   : 0,
                    msg     : "Do you really want to delete all of these?",
                    col_msg : "{i} = {m}"
                },
                {
                    cls     : "change",
                    url     : "http://localhost/datatables/Scripts/change.php/",
                    text    : "-CHANGE-",
                    params  : [0],
                    field   : 0,
                    changeData: 
                    {
                        changeIndex : [2, 5] // merubah data text pada index td
                    },
                    msg     : "Do you really want to change all of these?",
                    col_msg : "{i} = {m}"
                }
            ],
            thead: ["ID", "Name", "Grade", "Status", "Gender", "Birth", "Place"],
            
            search : 
                [
                    { index: 0, type: "input", placeholder: "Search ID..."}, // <i>If you hide this index, this is will not show at all.</i>
                    { index: 1, type: "input", placeholder: "Search Name..."},
                    { index: 2, type: "input", placeholder: "Search Grade..."},
                    { index: 3, type: "select", value: [
                                                    ["", "All"], 
                                                    ["1", "Pass"],
                                                    ["0", "Not Pass"],
                                                ]
                    }
                ],
            // search: [
            //     { index: 0, type: "input", placeholder: "Search ID..."},
            //     { index: 1, type: "input", placeholder: "Search ID Pembayaran..."},
            //     { index: 2, type: "select", value: [
            //                                     ["", "Semua"], 
            //                                     [1, "Array ke 1"],
            //                                     [2, "Array ke 2"],
            //                                     [3, "Array ke 3"],
            //                                     [4, "Array ke 4"],
            //                                     [5, "Array ke 5"]
            //                                 ]
            //     },
            //     { index : 3, type: "select", group_by: { key : 2 , value : 3, default : ["", "Semua"] }}
            // ],
            // array_info: [
            //     { index: 2, value: { 
            //         1: "Info Array ke 1",
            //         2: "Info Array ke 2",
            //         3: "Info Array ke 3",
            //         4: "Info Array ke 4",
            //         5: "Info Array ke 5"
            //         }
            //     }
            // ],
            //theadFixed: true,
            order_by: [0, "DESC"],
            action: [
                {   cls     : "edit",
                    url     : "edit/",
                    text    : "_ubah_",
                    params  : [0, 1]
                },
                {
                    cls     : "delete",
                    url     : "http://localhost/datatables/Scripts/delete.php/",
                    text    : "_hapus_",
                    isRemove: true,
                    params  : [0],
                    field   : 0,
                    msg     : "Do you really want to delete this {i} : {m}?"
                },
                // {
                //     cls     : "add",
                //     url     : "add/",
                //     text    : "_add_"
                // },
                // {
                //     cls     : "detail",
                //     url     : "detail/",
                //     text    : "DETAIL"
                // },
                // {
                //     cls     : "download",
                //     url     : "download/",
                //     text    : "_download_"
                // },
                // {
                //     cls     : "search",
                //     url     : "search/",
                //     text    : "_search_"
                // },
                {
                    cls     : "change",
                    url     : "http://localhost/datatables/Scripts/change.php/",
                    text    : "_change_",
                    changeData: 
                    {
                        changeIndex : [2, 5] // merubah data text pada index td
                    }
                },
                // {
                //     cls     : "message",
                //     url     : "message/",
                //     text    : "_message_"
                // },
                // {
                //     cls     : "reject",
                //     url     : "reject/",
                //     text    : "_reject_"
                // },
                // {
                //     cls     : "accept",
                //     url     : "accept/",
                //     text    : "_accept_"
                // }
            ]
        });
    </script>
</body>
</html>