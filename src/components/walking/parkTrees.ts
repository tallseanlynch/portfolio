const tree0 = [
    [{"x":0,"y":0,"z":0},{"x":0.07532461931233748,"y":0.5518146908610481,"z":0.025193141520473066},{"x":0.07325345804910349,"y":0.9241047773162643,"z":0.30484065716988035},{"x":0.2840157033609609,"y":1.8492106833505242,"z":0.4428341569924818},{"x":0.3745064109231374,"y":2.195354733455006,"z":0.044785213929837954}],
    [{"x":0.3745064109231374,"y":2.195354733455006,"z":0.044785213929837954},{"x":1.3665258095780088,"y":4.700131144721922,"z":0.33750493871547677},{"x":1.9017671216396779,"y":7.344267146954581,"z":2.0437062887840893},{"x":3.2309419868248823,"y":10.08943371470931,"z":1.9562967746273672},{"x":4.373080633261551,"y":12.668943306456187,"z":1.5941830373735262}],
    [{"x":0.07325345804910349,"y":0.9241047773162643,"z":0.30484065716988035},{"x":1.0341528610519217,"y":2.2141312621800244,"z":1.2671577495220707},{"x":1.4926308681732972,"y":3.709240199000754,"z":0.909690180325593},{"x":3.0091866424335625,"y":5.009180429646708,"z":3.2013440207607604},{"x":2.957782341293156,"y":6.316575658822917,"z":4.206736170926875}],
    [{"x":0.3745064109231374,"y":2.195354733455006,"z":0.044785213929837954},{"x":1.196041084558877,"y":4.782746217862937,"z":1.0424766409801278},{"x":2.1055393105600837,"y":7.413756405404657,"z":2.012104120373402},{"x":2.082091011131064,"y":9.75778867161276,"z":0.728660761969653},{"x":3.2673187561481356,"y":12.481460116292192,"z":3.238626699216925}],
    [{"x":0.2840157033609609,"y":1.8492106833505242,"z":0.4428341569924818},{"x":1.0614955018729613,"y":4.204301238181621,"z":1.3297610148360302},{"x":2.2512171759646358,"y":6.155347951644473,"z":0.7199632748309901},{"x":1.0648285938222968,"y":8.521119209436103,"z":2.9828791659905622},{"x":4.279031864314456,"y":10.81557785616306,"z":1.6188675072356968}],
    [{"x":0.3745064109231374,"y":2.195354733455006,"z":0.044785213929837954},{"x":0.8667914475477843,"y":4.729768026078932,"z":1.0327915038551518},{"x":1.0093808203734187,"y":7.227111139511971,"z":0.28566054223274434},{"x":2.5100798685236096,"y":9.960772150384862,"z":2.6229374477929075},{"x":4.243746081272741,"y":12.47799397322835,"z":3.6905747867311107}],
    [{"x":1.0614955018729613,"y":4.204301238181621,"z":1.3297610148360302},{"x":0.6665051928871487,"y":8.529117019671421,"z":1.3048027700835443},{"x":1.072011401054273,"y":12.910503929319791,"z":0.362144880251172}],
    [{"x":1.4926308681732972,"y":3.709240199000754,"z":0.909690180325593},{"x":2.0944488455527805,"y":7.678968904638232,"z":0.3643040696309173},{"x":2.4224116466427947,"y":11.512530296303686,"z":2.25861748460025}],
    [{"x":1.4926308681732972,"y":3.709240199000754,"z":0.909690180325593},{"x":2.490262990184963,"y":7.662525433885111,"z":1.3734234964613647},{"x":2.613025173807231,"y":11.716505725936702,"z":1.8530027738927903}],
    // [{"x":0,"y":0,"z":0},{"x":0.9999501055427031,"y":0.10814275276312768,"z":0.4218742791192489},{"x":-0.3619597638756268,"y":0.27712641811555455,"z":0.42654030306323254}],
    // [{"x":2.490262990184963,"y":7.662525433885111,"z":1.3734234964613647},{"x":2.216741693547463,"y":15.504502284709728,"z":1.4107178302299697},{"x":4.31781506437414,"y":23.400331098904406,"z":3.056421140500933}]
];

const tree1 = [
    [{"x":0,"y":0,"z":0},{"x":0.1400035489871426,"y":0.38703452884531275,"z":0.03442579621266663},{"x":0.06784818866446281,"y":0.7301846009053471,"z":0.08316250263940156},{"x":0.23071017168516583,"y":1.4475713307267233,"z":0.22479540975138976},{"x":0.5152702744838171,"y":2.0342415788297377,"z":0.123621677962397}],
    [{"x":0.06784818866446281,"y":0.7301846009053471,"z":0.08316250263940156},{"x":1.053684687236846,"y":1.5846469723737469,"z":0.8747528552647992},{"x":2.024945583785562,"y":2.8882649074761764,"z":1.7455085576106784},{"x":2.361715322666237,"y":4.254822327726842,"z":1.7114252898602433},{"x":3.91100850357922,"y":5.127090657482838,"z":1.1517272883663232}],
    [{"x":0.1400035489871426,"y":0.38703452884531275,"z":0.03442579621266663},{"x":0.7283889353562704,"y":0.9691562274949778,"z":1.0129562017527585},{"x":2.0611609536648503,"y":1.634638138557013,"z":1.7718661893808432},{"x":2.051997393790598,"y":2.3183625882487924,"z":2.9857638423299018},{"x":4.082922764612307,"y":3.087278229521623,"z":3.992668213959219}],
    [{"x":0.5152702744838171,"y":2.0342415788297377,"z":0.123621677962397},{"x":1.16082781339052,"y":4.620768255850483,"z":1.1118384319290782},{"x":2.5094900087143506,"y":7.238693147031554,"z":0.4221908982815916},{"x":3.515187698515787,"y":9.807481062045875,"z":2.996217174510258},{"x":4.490398323627106,"y":11.966658703533234,"z":3.7390066905613533}],
    [{"x":0.5152702744838171,"y":2.0342415788297377,"z":0.123621677962397},{"x":0.6218963069077583,"y":4.221916773409891,"z":0.8868268009530097},{"x":1.3543316632788338,"y":6.79080405110022,"z":1.3167772419883743},{"x":2.714008130076521,"y":8.929794657116691,"z":1.054155135128435},{"x":1.8379934904403508,"y":11.249234742578082,"z":4.1234359143040935}],
    [{"x":0.06784818866446281,"y":0.7301846009053471,"z":0.08316250263940156},{"x":0.6593103072385981,"y":1.7536730593803853,"z":0.9688579711245096},{"x":1.9875012166497794,"y":2.74733674892259,"z":1.6886776687159277},{"x":2.2995037358165655,"y":3.9319280843571294,"z":1.5184389499488242},{"x":1.4815872262214294,"y":5.277885895926616,"z":2.5347231022261436}],
    [{"x":0.06784818866446281,"y":0.7301846009053471,"z":0.08316250263940156},{"x":0.27759444265773464,"y":1.6646208044523516,"z":1.0728055334837987},{"x":0.3816327636899262,"y":2.6795130735074437,"z":0.19599700078303706}],
    [{"x":0.6218963069077583,"y":4.221916773409891,"z":0.8868268009530097},{"x":0.14837362240834956,"y":8.737973381615488,"z":1.316571074829491},{"x":-0.13773374786059,"y":13.222113964782068,"z":2.826839427251851}],
    [{"x":1.4815872262214294,"y":5.277885895926616,"z":2.5347231022261436},{"x":2.3206479930915718,"y":10.851920948869852,"z":3.4626570420264366},{"x":3.1216028875192365,"y":16.473643615580926,"z":3.8895602205128377}],
    [{"x":0.6593103072385981,"y":1.7536730593803853,"z":0.9688579711245096},{"x":1.3092789439070787,"y":3.8715553803683087,"z":0.43978381255834},{"x":2.52366697668039,"y":5.8546659908233085,"z":2.1520670554256953}],
    // [{"x":3.1216028875192365,"y":16.473643615580926,"z":3.8895602205128377},{"x":3.433905266162726,"y":33.08301005725423,"z":3.637049451109532},{"x":2.839197446396273,"y":49.68316050333648,"z":4.395240987263962}]
];

const tree2 = [
    [{"x":0,"y":0,"z":0},{"x":0.028586019597859412,"y":0.49076585628567304,"z":0.10591820638714379},{"x":0.26081558295513674,"y":1.1599231932262595,"z":0.27139536210631077},{"x":0.4110731241573229,"y":1.9815968561724069,"z":0.08720886841755236},{"x":0.23202792371786599,"y":2.664378094546915,"z":0.27910572747271406}],
    [{"x":0.028586019597859412,"y":0.49076585628567304,"z":0.10591820638714379},{"x":0.20680411200373403,"y":1.2226275567750728,"z":-0.07032798952355997},{"x":0.5507402928657634,"y":2.100482010063139,"z":0.4956506968632254},{"x":3.02109179930329,"y":3.0046083866500752,"z":2.5457444843847945},{"x":0.6795970943017308,"y":3.9255531193010813,"z":2.004572855923574}],
    [{"x":0.26081558295513674,"y":1.1599231932262595,"z":0.27139536210631077},{"x":0.7926756398439201,"y":2.913654226774442,"z":0.5072799900938756},{"x":0.08089730683426172,"y":4.629275875681714,"z":0.7210120845660872},{"x":2.0278689588542087,"y":6.361209843879229,"z":3.271364548084641},{"x":2.7371446539508324,"y":7.946023452087545,"z":0.4390604951611738}],
    [{"x":0.26081558295513674,"y":1.1599231932262595,"z":0.27139536210631077},{"x":0.46941049193077367,"y":2.8806245096700875,"z":-0.05244013765729083},{"x":1.5724756822565467,"y":4.178221728829685,"z":1.6840995642870509},{"x":3.260332544296528,"y":5.500249325123118,"z":2.4442219097692974},{"x":2.5792105486271306,"y":7.25029028634147,"z":-0.33129853466913406}],
    [{"x":0.4110731241573229,"y":1.9815968561724069,"z":0.08720886841755236},{"x":0.590571942137534,"y":4.365551572994708,"z":0.44505167626364545},{"x":0.605281886319592,"y":6.914725204650498,"z":1.5958937274793485},{"x":2.0111514580155445,"y":9.342741451360643,"z":-1.3200809384362644},{"x":3.0816808846947357,"y":11.919566769181216,"z":-0.9541481244346443}],
    [{"x":0.23202792371786599,"y":2.664378094546915,"z":0.27910572747271406},{"x":0.9254252778758101,"y":5.67348350044154,"z":-0.020747865619248906},{"x":0.24616561765340686,"y":8.727467843783531,"z":0.6030177802011409},{"x":3.2316237373915975,"y":11.744453360895603,"z":0.47840297182712566},{"x":2.333443024119242,"y":14.938661868689506,"z":1.2374560538588373}],
    [{"x":0.26081558295513674,"y":1.1599231932262595,"z":0.27139536210631077},{"x":-0.5831003169158702,"y":2.6432044660667793,"z":-0.46244661086876937},{"x":0.9515550939421465,"y":3.9347149053059636,"z":0.30028230599889044}],
    [{"x":0.4110731241573229,"y":1.9815968561724069,"z":0.08720886841755236},{"x":1.281210249179984,"y":4.2947461670354246,"z":0.8903141233169724},{"x":-1.5812767570054556,"y":6.622198333961374,"z":-1.6314575503213893}],
    [{"x":0.4110731241573229,"y":1.9815968561724069,"z":0.08720886841755236},{"x":0.4492789963134076,"y":4.179440911533864,"z":-0.4838332140288717},{"x":1.7763930074762309,"y":6.282554972742821,"z":2.0673894069129135}],
    [{"x":3.02109179930329,"y":3.0046083866500752,"z":2.5457444843847945},{"x":3.37277247362195,"y":6.30912929791995,"z":1.5638169279208638},{"x":3.9181757468504896,"y":9.573738643561025,"z":2.935126264817695}],
    [{"x":0.26081558295513674,"y":1.1599231932262595,"z":0.27139536210631077},{"x":-0.15055281433356693,"y":2.4251747942501085,"z":1.1665887317870889},{"x":1.054067317897784,"y":3.7352525759745747,"z":-1.1670190542751209}]
]


const tree3 = [
    [{"x":0,"y":0,"z":0},{"x":0.0490394381024088,"y":0.6096617413707737,"z":0.056415064472509775},{"x":0.02828782818623216,"y":1.6689975137248947,"z":0.1283123586153246},{"x":0.008976116715665838,"y":2.742996133534045,"z":0.0011400874695526547},{"x":0.13255322505160858,"y":3.115264696091848,"z":0.29479387276468144}],
    [{"x":0.02828782818623216,"y":1.6689975137248947,"z":0.1283123586153246},{"x":0.150480879992426,"y":3.4870050727782425,"z":0.3626665869726865},{"x":1.091685497778935,"y":5.512895814901414,"z":2.0631496234793065},{"x":0.7293408161426884,"y":7.654029485646622,"z":1.2423918460889405},{"x":3.3195115927278076,"y":9.675956771271375,"z":3.46106262118117}],
    [{"x":0.0490394381024088,"y":0.6096617413707737,"z":0.056415064472509775},{"x":0.7789283123023989,"y":1.7778354945383783,"z":0.738789814228808},{"x":0.3228431637696475,"y":2.788763172593021,"z":1.9547427608202335},{"x":2.972852154103317,"y":3.671237002908331,"z":0.7532990648892602},{"x":-0.8127877048575624,"y":4.646165771956378,"z":3.5344627063022025}],
    [{"x":0.0490394381024088,"y":0.6096617413707737,"z":0.056415064472509775},{"x":1.0449365443215286,"y":1.5660489512590374,"z":0.19811277563118915},{"x":2.0082606888870926,"y":2.556518184533021,"z":1.2032046650892183},{"x":2.1407066667936006,"y":3.6955704064267003,"z":-1.1030500891722614},{"x":3.51054149907573,"y":4.6072372085744675,"z":0.2713240974597089}],
    [{"x":0.13255322505160858,"y":3.115264696091848,"z":0.29479387276468144},{"x":1.0965119044475355,"y":6.501355989399473,"z":1.274329904381917},{"x":-0.5702739575109481,"y":9.71732417184712,"z":-0.26233098550777373},{"x":0.17000852106342187,"y":12.954463478905657,"z":1.8219596640148916},{"x":1.6967836443658044,"y":16.463222355746467,"z":1.3368689803159366}],
    [{"x":0.008976116715665838,"y":2.742996133534045,"z":0.0011400874695526547},{"x":0.5270867497277549,"y":5.923214081861817,"z":0.5664758708834738},{"x":0.02902855644444345,"y":9.182549933045314,"z":-0.4120961231286967},{"x":-1.698693806749807,"y":12.458114879685626,"z":-0.38641887991035995},{"x":2.7766986660843114,"y":15.344134180662925,"z":-1.7228322306210417}],
    [{"x":0.0490394381024088,"y":0.6096617413707737,"z":0.056415064472509775},{"x":-0.3675479790366905,"y":1.5318670427327796,"z":-0.10080452302534298},{"x":-1.3853206439563444,"y":2.465515560587681,"z":0.5305270944046498}],
    [{"x":2.1407066667936006,"y":3.6955704064267003,"z":-1.1030500891722614},{"x":2.6993017200971,"y":7.570835421254483,"z":-0.9071858189770774},{"x":1.5533256586946576,"y":11.5164789528455,"z":-3.061839170955971}],
    [{"x":2.0082606888870926,"y":2.556518184533021,"z":1.2032046650892183},{"x":2.246122118369521,"y":5.21660203318548,"z":1.9168958277520876},{"x":3.4109495989246015,"y":7.908724676838503,"z":-0.6751283405776698}],
    [{"x":2.1407066667936006,"y":3.6955704064267003,"z":-1.1030500891722614},{"x":1.442829416614571,"y":7.491702846419146,"z":-1.8256368236304374},{"x":3.174477582015168,"y":11.391319958823559,"z":-0.6227546129185151}],
    [{"x":1.0449365443215286,"y":1.5660489512590374,"z":0.19811277563118915},{"x":1.9560846683732556,"y":3.2769649389551603,"z":0.881943416913006},{"x":-0.8807908101430029,"y":5.135378755803511,"z":-1.142378158754423}]
]


const tree4 = [
    [{"x":0,"y":0,"z":0},{"x":0.022060054951588737,"y":0.9335505632576032,"z":0.035098663752739075},{"x":0.009637826033340595,"y":2.06807302347303,"z":0.2435026942941581},{"x":0.042597720281936174,"y":2.341990373407417,"z":0.2609790612537582},{"x":0.05490143355114047,"y":3.2512429659554543,"z":0.28190852571882885}],
    [{"x":0.042597720281936174,"y":2.341990373407417,"z":0.2609790612537582},{"x":0.6595501866847556,"y":4.923378597555336,"z":0.10689037748034422},{"x":0.05987040327489518,"y":7.580060767807811,"z":2.0840786424140556},{"x":1.908959731756226,"y":10.456838254617661,"z":0.9207318302903209},{"x":3.9128646740737154,"y":13.325822488183706,"z":1.39007882949215}],
    [{"x":0.05490143355114047,"y":3.2512429659554543,"z":0.28190852571882885},{"x":-0.16701314202899936,"y":7.14363295677215,"z":1.281572990648523},{"x":1.242567860253836,"y":10.780017747679095,"z":1.1392615776411845},{"x":1.0727054758612857,"y":14.400442522836158,"z":1.7961858155321413},{"x":1.682751523426345,"y":18.145747017864217,"z":0.15646292795592445}],
    [{"x":0.009637826033340595,"y":2.06807302347303,"z":0.2435026942941581},{"x":-0.3454429501904377,"y":4.363875073850206,"z":1.2409845940325477},{"x":0.40905243547482945,"y":6.790025880610319,"z":2.1982057703679936},{"x":2.8269299699767405,"y":9.182488128291089,"z":1.9678053766558448},{"x":2.8801620911837147,"y":11.54941700807646,"z":3.633829289586975}],
    [{"x":0,"y":0,"z":0},{"x":0.4211359354237647,"y":0.3808343584514595,"z":-0.02431474443575075},{"x":1.833043366081188,"y":0.5768381815748544,"z":1.3454497766328812},{"x":-1.0416552667594363,"y":0.7285071158657537,"z":2.857450716791814},{"x":-0.41843389076504095,"y":0.9615328678441336,"z":3.367711476411833}],
    [{"x":0.05490143355114047,"y":3.2512429659554543,"z":0.28190852571882885},{"x":0.5480201294927572,"y":6.851402720867801,"z":1.2781656984857053},{"x":1.802737342350378,"y":10.559007760799908,"z":0.887721952433656},{"x":-0.972116605767117,"y":13.965618245789246,"z":-0.04339952167473088},{"x":3.685343378231988,"y":17.77786801760942,"z":3.7489759786844057}],
    [{"x":-0.16701314202899936,"y":7.14363295677215,"z":1.281572990648523},{"x":-0.7426883380220337,"y":14.477874865403363,"z":1.0953531962271252},{"x":-2.0961026377677126,"y":21.860653774897482,"z":0.7842114912002266}],
    [{"x":0.009637826033340595,"y":2.06807302347303,"z":0.2435026942941581},{"x":1.0067188628106287,"y":4.3664109263190465,"z":0.346766852741336},{"x":0.1589376709565524,"y":6.544172670668869,"z":-1.3970311027864135}],
    [{"x":0.009637826033340595,"y":2.06807302347303,"z":0.2435026942941581},{"x":0.9756455033492779,"y":4.442678501555928,"z":1.1101359173634784},{"x":1.2521857375070675,"y":6.6265296334209705,"z":-1.52263689024761}],
    [{"x":0.05490143355114047,"y":3.2512429659554543,"z":0.28190852571882885},{"x":-0.60274770104,"y":6.830658539027107,"z":0.8818545344488165},{"x":1.9424390560152904,"y":10.277632240504118,"z":2.1590002694728856}],
    [{"x":1.2521857375070675,"y":6.6265296334209705,"z":-1.52263689024761},{"x":0.5791749807056288,"y":13.52984952650307,"z":-0.9105534141171636},{"x":1.503204632149497,"y":20.447610078413756,"z":-2.035645103656768}]
]

const tree5 = 
[
    [{"x":0,"y":0,"z":0},{"x":0.03797904732399697,"y":0.6961452925721764,"z":0.11991908184649297},{"x":0.15244265470471377,"y":1.3776624697444033,"z":0.08785353172020556},{"x":0.3550611080155591,"y":1.6267620708611594,"z":0.39438553888822236},{"x":0.07147946858503992,"y":2.4132994869664897,"z":0.47035587051164796}],
    [{"x":0.3550611080155591,"y":1.6267620708611594,"z":0.39438553888822236},{"x":0.4964341039045961,"y":3.615041308538642,"z":1.250448348005836},{"x":0.7080205511763662,"y":5.500201615277524,"z":1.3519387526747626},{"x":2.7638149647441557,"y":7.278598833979884,"z":2.9914705667148724},{"x":2.5386315455482755,"y":9.017704873980064,"z":3.415277176870225}],
    [{"x":0,"y":0,"z":0},{"x":-0.111911425406566,"y":0.36021001967100674,"z":0.24760201799807394},{"x":1.9954199671751414,"y":0.6959396709701491,"z":-0.02440871171912246},{"x":2.8485261468460816,"y":0.8863220696473864,"z":0.19791648722008864},{"x":0.20002673327406317,"y":1.4865644616652949,"z":2.7239529724739864}],
    [{"x":0.07147946858503992,"y":2.4132994869664897,"z":0.47035587051164796},{"x":0.6135830270712328,"y":5.2373669929838105,"z":1.4484737329618291},{"x":-0.4995787949889825,"y":7.986264602431879,"z":-0.4106775853646981},{"x":0.8374534806016739,"y":10.636157129308568,"z":2.073396686117688},{"x":3.9980420779412746,"y":13.359981826954746,"z":2.9772593393339912}],
    [{"x":0.07147946858503992,"y":2.4132994869664897,"z":0.47035587051164796},{"x":0.09404017267954781,"y":4.968617645004283,"z":-0.030988252163505536},{"x":1.46881139557049,"y":7.922745258982457,"z":0.8847383369893543},{"x":-1.525912003478885,"y":10.93706007662649,"z":2.7837698965886046},{"x":2.620201438555349,"y":13.67787028743051,"z":1.1002231524282884}],
    [{"x":0.15244265470471377,"y":1.3776624697444033,"z":0.08785353172020556},{"x":1.0000031226929296,"y":3.2636951152496625,"z":1.0651203473646156},{"x":0.031013114884310286,"y":5.200667628160173,"z":0.3396129072001398},{"x":2.2364647334187646,"y":6.786144260906296,"z":2.285108722381638},{"x":2.1949580531202604,"y":8.582580720577823,"z":3.838010327439559}],
    [{"x":0.07147946858503992,"y":2.4132994869664897,"z":0.47035587051164796},{"x":0.22518795275728598,"y":4.987351602657856,"z":0.3764790919488482},{"x":2.044882748552993,"y":7.673578867527841,"z":-1.1840954178697172}],
    [{"x":0,"y":0,"z":0},{"x":0.7763410660002805,"y":0.30302506968051546,"z":0.45240108799120454},{"x":0.8320716818081412,"y":0.43262693992596435,"z":-0.41266690221281477}],
    [{"x":0.15244265470471377,"y":1.3776624697444033,"z":0.08785353172020556},{"x":0.23234688576600898,"y":3.0006404166758487,"z":-0.30427833657318715},{"x":2.005460933751784,"y":4.54103656647079,"z":0.452993032787481}],
    [{"x":0.3550611080155591,"y":1.6267620708611594,"z":0.39438553888822236},{"x":-0.6404103924392178,"y":3.5155968967965543,"z":-0.10816444456422547},{"x":2.2745398025708905,"y":5.425831418958298,"z":1.2359198967476235}],
    [{"x":0.22518795275728598,"y":4.987351602657856,"z":0.3764790919488482},{"x":-0.005845068441878876,"y":10.30136818814191,"z":0.46725115269984463},{"x":-0.9477271435371033,"y":15.604717415198797,"z":0.7604161129449047}]
]

const trees = [
    tree0,
    tree1,
    tree2,
    tree3,
    tree4,
    tree5
];

export { trees };