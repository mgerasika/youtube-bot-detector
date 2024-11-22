For deploy new image:
sh build.sh
sudo docker tag youtube-bot-downloader mgerasika/youtube-bot-downloader:v13
sudo docker login
sudo docker push mgerasika/youtube-bot-downloader:v13

# on another pc
docker pull mgerasika/youtube-bot-downloader:v12
docker run --network=host --restart=always --env PORT=8099 -v /home:/home -d \
  -p $port:8099 \
  --env RABBIT_MQ=amqp://test:Zxc123=-@178.210.131.101:5672 \
  --env API_SERVER_URL=http://178.210.131.101:8077 \
  --env REDIS_URL=redis://178.210.131.101:6379 \
  --name youtube-bot-downloader \
  mgerasika/youtube-bot-downloader:v12


@NBCNews UCeY0bbntWzzVIaj2z3QigXg
@CBSNews UC8p1vwvWtl6T73JiExfWs1g
@FoxNews UCXIJgqnII2ZOINSWNOGFThA

@tsn UCXoJ8kY9zpLBEz-8saaT3ew
@УкраїнськаПравда UChparf_xrUZ_CJGQY5g4aEg
@unian UCKCVeAihEfJr-pGH7B73Wyg
@ButusovPlus UCg7T647ROSeONOCHeNMBduQ

@mgerasika UCqOowQp96vnKJ_e4eoDvUsA
@army_tv_ua UCWRZ7gEgbry5FI2-46EX3jA
@IstoriyaBezMifiv UCXx3yVx9paWJ-BLZVqQ8CRQ
@bootuseua UCk_mTOq1CM29S3fvIaV0Gdw
@portnikov UCV0ZrOPCKzqx36rRiPHkwFg
@liga_net UCozzcggrnIZPLgDSVA4qKCQ
@FaktyICTVchannel UCG26bSkEjJc7SqGsxoHNnbA
@UKRAINETODAY24 UCjAg2-3PgoksLAkYE88S_6g
@RadaTVchannel UC5V8mErVFOpcQXEb3y9IMZw
@weukrainetv UCEduOt4TK8TtOaznB45TrhA
@1plus1 UCVEaAWKfv7fE1c-ZuBs7TKQ
@НароднаДумка UCsWMSE0bHdHLCqsMXUfQeSA
@lugablog UCWParBCQ4W46CDNAxA5IXFg
@DmytriyGordon UCZIFo5MmrUJS5JbLOxgnHuQ
@NevzorovTV UC8kI2B-UUv7A5u3AOUnHNMQ
@Censor_Net UC2J8-ykgWRStTGy6uUvhr_A
@pryamiy  UCH9H_b9oJtSHBovh94yB5HA
@Taras.Berezovets UC7FEBULCrgaFxH05t6mYeHA
@STERNENKO UC5HBd4l_kpba5b0O1pK-Bfg
@MackNack UCgpSieplNxXxLXYAzJLLpng
@OlegZhdanov UC111NXlcDs0VGfyre6EiPmA
@Taras_Lawyer UCxS4p_IE2fQG5kJu9coxn4w
@ZnajUA UCCj_la08uOQ1teL2dD-xcRw
@dneprexpress UC1h4sv6jq8vrKvtyNSqbpYQ
@EspresoTv UCMEiyV8N2J93GdPNltPYM6w
@hromadske_ua UC2oGvjIJwxn1KeZR3JtE-uQ
@PresidentGovUa UCncq73xfx9sVA3Ht2uVRrCw
@RadioSvobodaUkraine UC-wWyFdk_txbZV8FKEk0V8A
@arestovych UCjWy2g76QZf7QLEwx4cB46g
@YuriyRomanenko_Ukraine UCY2z9noVRgOx0AZwqMCLuBA
@FeyginLive UCQVtD_N4OeD-9PshBq7NwyQ
@yuryshvets UCb2oej0JtxlnywlqoSiHHVQ
@Max_Katz UCUGfDbfRIx51kJGGHIFo8Rw
@varlamov UC101o-vQ2iOj9vr00JUlyKw


// ---------------Youtube accounts-----------------------

yt.bot.detector01@gmail.com
AIzaSyDYshEhg5V5lsGY6G2MS4NeZyyEPRxa934

maxpetrovich1999lv@gmail.com
AIzaSyAYMusX10yefDxcWHc3TNgTHYqtBOqlx20

olenapos2001@gmail.com
AIzaSyBrdR-bGAhIgMlANcPElJkvomu0ZEhsctQ

fednestew@gmail.com
AIzaSyDysDn8aoLgA6V29ocs732cVS-GGOgyaL4

ronstewmanh@gmail.com
AIzaSyA7s5mtLk3_PjNMxqUxpCz6q8ZCzw1AmA8

salvagorortex@gmail.com
AIzaSyAF_kfnmcWbHhKeRf2Std18T1nMt0LaXPo

omendolacroc@gmail.com
AIzaSyD3nMYNckt5oZrP-ZD-36qNBsY5rjTNBeE

mariamenholia@gmail.com
AIzaSyDy6aB24a28Gt1lOaBzFMMSTzrnJ9urEQg

veronbercus@gmail.com
AIzaSyAUvxiX-TLNgwom82M0wFDmeOdg1EmcPtY

zharzetkomprew@gmail.com
AIzaSyAeaJiSCVS-W1wfUEFZGco6ubR6Bw3RoXw

aserikgopier@gmail.com
AIzaSyArgpuQTxiobjSlsyNdG1BWJYpHFEwAjp8

rebenarohos@gmail.com
AIzaSyBzuYaEqvHK6Okdxf-jrQ1Uo6ZbzNmwH3E

feranizulie@gmail.com
AIzaSyAbIXno9hZYpod8IdnmgYlxDNdnb_nIUbE

pereradviktor@gmail.com
AIzaSyDifm2V1ve1gS1rtHsa_AehUsd9xiS8lNQ

gugyxeroxin@gmail.com
AIzaSyD-b-poiRrvsr7OB9deUIJIzBDX_HShZNs

reserwcosta@gmail.com
AIzaSyDZjdud4lIXiBkBixcNs-p4EsVh8HqSznQ

dupitcusit@gmail.com
AIzaSyBF6HRwXeyWS-ceBWVmwZB6AbTtgmpsV8U

nickdipick@gmail.com
AIzaSyDiFNb1VrnhkUJlkgfIrN4qJBwfJSiW9Sg

durandaamanda@gmail.com
AIzaSyBtTM9tl8uXkIqEf8IlcA5HzeOXH8dlIe0

pukachzrewio@gmail.com
AIzaSyDDve5a7TRqy84acocmf8qiAAiHWH0M8z8

orenapetrova@gmail.com
AIzaSyAO2Xm_veE2PLgM27aXy5m2-pa6g83XPB0

kakalakitina@gmail.com
AIzaSyBupl4vJHzNWT8OEjnvtfgONvzOEwUQ7CE

mamaspasin@gmail.com
AIzaSyBqNTI-Bl2nygATNe8ClpZcJIwC_BZnU5E

zeniksuchiy@gmail.com
AIzaSyCn4gmzqulpmg55J9hj9qW_v2tnBtUfTKo


INSERT INTO public.api_key(
    email, youtube_key, status
)
VALUES
    ('yt.bot.detector01@gmail.com', 'AIzaSyDYshEhg5V5lsGY6G2MS4NeZyyEPRxa934', 'active'),
    ('maxpetrovich1999lv@gmail.com', 'AIzaSyAYMusX10yefDxcWHc3TNgTHYqtBOqlx20', 'active'),
    ('olenapos2001@gmail.com', 'AIzaSyBrdR-bGAhIgMlANcPElJkvomu0ZEhsctQ', 'active'),
    ('fednestew@gmail.com', 'AIzaSyDysDn8aoLgA6V29ocs732cVS-GGOgyaL4', 'active'),
    ('ronstewmanh@gmail.com', 'AIzaSyA7s5mtLk3_PjNMxqUxpCz6q8ZCzw1AmA8', 'active'),
    ('salvagorortex@gmail.com', 'AIzaSyAF_kfnmcWbHhKeRf2Std18T1nMt0LaXPo', 'active'),
    ('omendolacroc@gmail.com', 'AIzaSyD3nMYNckt5oZrP-ZD-36qNBsY5rjTNBeE', 'active'),
    ('mariamenholia@gmail.com', 'AIzaSyDy6aB24a28Gt1lOaBzFMMSTzrnJ9urEQg', 'active'),
    ('veronbercus@gmail.com', 'AIzaSyAUvxiX-TLNgwom82M0wFDmeOdg1EmcPtY', 'active'),
    ('zharzetkomprew@gmail.com', 'AIzaSyAeaJiSCVS-W1wfUEFZGco6ubR6Bw3RoXw', 'active'),
    ('aserikgopier@gmail.com', 'AIzaSyArgpuQTxiobjSlsyNdG1BWJYpHFEwAjp8', 'active'),
    ('rebenarohos@gmail.com', 'AIzaSyBzuYaEqvHK6Okdxf-jrQ1Uo6ZbzNmwH3E', 'active'),
    ('feranizulie@gmail.com', 'AIzaSyAbIXno9hZYpod8IdnmgYlxDNdnb_nIUbE', 'active'),
    ('pereradviktor@gmail.com', 'AIzaSyDifm2V1ve1gS1rtHsa_AehUsd9xiS8lNQ', 'active'),
    ('gugyxeroxin@gmail.com', 'AIzaSyD-b-poiRrvsr7OB9deUIJIzBDX_HShZNs', 'active'),
    ('reserwcosta@gmail.com', 'AIzaSyDZjdud4lIXiBkBixcNs-p4EsVh8HqSznQ', 'active'),
    ('dupitcusit@gmail.com', 'AIzaSyBF6HRwXeyWS-ceBWVmwZB6AbTtgmpsV8U', 'active'),
    ('nickdipick@gmail.com', 'AIzaSyDiFNb1VrnhkUJlkgfIrN4qJBwfJSiW9Sg', 'active'),
    ('durandaamanda@gmail.com', 'AIzaSyBtTM9tl8uXkIqEf8IlcA5HzeOXH8dlIe0', 'active'),
    ('pukachzrewio@gmail.com', 'AIzaSyDDve5a7TRqy84acocmf8qiAAiHWH0M8z8', 'active'),
    ('orenapetrova@gmail.com', 'AIzaSyAO2Xm_veE2PLgM27aXy5m2-pa6g83XPB0', 'active'),
    ('kakalakitina@gmail.com', 'AIzaSyBupl4vJHzNWT8OEjnvtfgONvzOEwUQ7CE', 'active'),
    ('mamaspasin@gmail.com', 'AIzaSyBqNTI-Bl2nygATNe8ClpZcJIwC_BZnU5E', 'active'),
    ('zeniksuchiy@gmail.com', 'AIzaSyCn4gmzqulpmg55J9hj9qW_v2tnBtUfTKo', 'active')
ON CONFLICT (youtube_key)
DO UPDATE SET
    email = EXCLUDED.email,
    status = EXCLUDED.status;

