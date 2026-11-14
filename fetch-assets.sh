#!/usr/bin/env bash
# Downloads the COMPEL 2027 site assets listed in SPEC.md section 6 into ./assets-src
set -u
mkdir -p assets-src
cd assets-src || exit 1

CDN="https://cdn.fourwaves.com/static/media"
API="https://api.fourwaves.com/api/files/serve"

get() { # get <local-name> <url>
  if curl -fsSL --retry 2 -o "$1" "$2"; then
    echo "ok    $1 ($(wc -c < "$1") bytes)"
  else
    echo "FAIL  $1  <- $2"
    rm -f "$1"
  fi
}

get logo-banner.png      "$CDN/filecontent/1235f310-b9ea-48fc-a941-563d8c7a0e1d/be24bbef-b3b7-4593-a271-ae069b0d248d.png"
get header-current.png   "$CDN/headers/576586d2-fed8-42b6-bc47-75de3383ab8d/7d567483-69d6-4a56-ac01-772a6881d907.png"
get dates-table.png      "$CDN/filecontent/2a965ec2-6689-4883-9d33-3005101c8d82/424b5168-55a0-4d7a-96ab-2827b2223fbd.png"
get venue-welch.jpg      "$CDN/filecontent/9c1c6884-a20f-4981-9066-bbe9751cb298/26091726-207e-4cf2-9ad1-fd6fcd0882bc.jpg"
get venue-eer.jpg        "$CDN/filecontent/e476a8ca-67af-418f-bb66-28f7dc0b7e43/d0c97f34-e83e-4f2c-a63a-758bf4956b8a.jpg"
get venue-pickle.jpg     "$CDN/filecontent/efbe51a9-c116-4bb5-b1a6-9465fdec03ce/0c49ac12-8af3-417e-8110-91b608c2aabb.jpg"
get committee-hanson.jpg "$CDN/filecontent/3578c178-c001-4f91-841d-fd4b034c34f3/f1f28e2d-b1cd-411d-aa93-b120d9327b95.jpg"
get committee-huang.jpg  "$CDN/speakercontent/539d04af-fe28-414f-ab2d-563cb0b39ffc/1a61da46-2e5e-47b4-90a5-2f007279531c.jpg"
get committee-johnson.jpg "$CDN/speakercontent/cf359026-e6dd-4a91-b67a-1214f18cb9dd/05b44157-729f-4f8d-b580-d40cf50639b6.jpg"
get committee-zhu.jpg    "$CDN/speakercontent/941cbdbc-d31c-4b0e-bdcb-f4b86af692f7/07d0b648-2118-4273-8d5a-5a1e3b7eedd4.jpg"
get IEEE-COMPEL-2027-Call-for-Papers-Flyer.pdf "$API/8d105803-0c6c-4ea7-b8e4-53c77e64d43c"
get digest_sample_compel_2027.pdf              "$API/452db46f-ca87-48b9-9e75-cf4010b6430f"

echo
echo "Check that the two PDFs are real PDFs:"
file ./*.pdf 2>/dev/null || true
