
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs    = require('fs');

const app = express();
// 로그인
const loginDiagRouter     = require('./routes/loginDiag');
const loginPathRouter     = require('./routes/loginPath');

const registerRouter      = require('./routes/register');

const fileuploadRouter    = require('./routes/fileupload');

// 병리 리스트
const patientListPathRouter = require('./routes/patientlist_path');
const inhouseuploadRouter = require('./routes/inhouseupload');
const diseaseuploadRouter = require('./routes/diseaseupload');
const pathimageUploadRouter = require('./routes/imagefileupload');

// 2021.07.23
// 병리 연구용리스트
const patientListResearchRouter = require('./routes/patientlist_research');
const diseaseResaearchuploadRouter = require('./routes/diseaseResarchupload');
const pathResearchReportRouter   = require('./routes/pathResearchReportRouter'); 

// 진검
const patientListRouter     = require('./routes/patientlist');

// 2021.02.02 진검 report_patient
const reportPatientListRouter     = require('./routes/report_patient');

// 2021.10.13 진검 report_xml
const reportXmlRouter     = require('./routes/report_xml');


const patientListDiagRouter     = require('./routes/patientlist_diag');
const filteredTSVListRouter = require('./routes/filteredTSVlist');

const mutationInfoRouter        = require('./routes/mutationInfoList');
const geneExistRouter       = require('./routes/geneExist');
const addGeneInfoRouter     = require('./routes/addGeneToMutation');

// 사용자등록
//app.use('/register', registerRouter); 

// 사용자 관리
const manageUsersRouter      = require('./routes/manageUsersRouter');

//통계 관리 
const manageStatisticsRouter      = require('./routes/manageStatisticsRouter')

//함수 관리 
const manageFunctionsRouter      = require('./routes/manageFunctionsRouter');

//함수 상세 
const detailFunctionsRouter      = require('./routes/detailFunctionsRouter');

const commentsRouters     = require('./routes/ngscommentsRouter');
const artifactsRouters       = require('./routes/ngsartifactsRouter');
const benignRouters          = require('./routes/ngsbenignRouter');
const mutationRouters     = require('./routes/ngsmutationRouter');

// inhouse 
const commentsRouter     = require('./routes/commentsRouter');
const artifactsRouter       = require('./routes/artifactsRouter');
const benignRouter          = require('./routes/benignRouter');
const mutationRouter        = require('./routes/mutationRouter');

const commentsCountRouter   = require('./routes/commentsCountRouter');
const artifactsCountRouter  = require('./routes/artifactsCountRouter');
const benignCountRouter     = require('./routes/benignCountRouter');
const artifactsInsertRouter = require('./routes/artifactsInsertRouter');
const benignInsertRouter    = require('./routes/benignInsertRouter');

const geneCommentRouter     = require('./routes/geneCommentRouter');
const savedFilePathRouter   = require('./routes/savedFilePathRouter');

const searchpatientRouter   = require('./routes/searchRouter');
const searchpatientDiagRouter   = require('./routes/searchRouter_diag');
const searchpatientPathRouter   = require('./routes/searchRouter_path');

const diagGeneRouter                 = require('./routes/diagGeneRouter');
 
// EMR로 보내기
const emrRouter                 = require('./routes/emrroute');
const pathologyRouter           = require('./routes/pathologyRoute');
const { start } = require('repl');

const pathEmrUpdateRouter       = require('./routes/pathEmrUpdateRoute');

//screen 
const screenRouter                 = require('./routes/screenroute');
// 12.14
// all Sceen
const allScreenRouter                 = require('./routes/allscreenroute');

//2020.11.19 add
//2020.11.2 add
const amlReportRouter         = require('./routes/amlReportRouter');       //amlReportRouter.js 파일을 선언한다.
const pathologyReportRouter   = require('./routes/pathologyReportRouter'); //pathologyReportRouter.js 파일을 선언한다.

//2021.01.19
const pathologyImageRouter   = require('./routes/pathologyImageRouter');   //pathologyImageRouter.js 파일을 선언한다.

const amlSearchRouter         = require('./routes/amlSearchRouter');       //amlSearchRouter.js 파일을 선언한다.

const pathologySearchRouter  = require('./routes/pathologySearchRouter');  //pathologySearchRouter.js 파일을 선언한다.
//  병리 코멘트
const pathMentRouter           = require('./routes/pathMentRoute');

//12/14
const filteredOriginData   = require('./routes/filteredOriginData');  //filteredOriginData.js 파일을 선언한다. 
const msiscore   = require('./routes/msiscore');  //filteredOriginData.js 파일을 선언한다.
const tumorcellpercentage  = require('./routes/tumorcellpercentage');  //tumorcellpercentage.js 파일을 선언한다.
const tumorMutationalBurden  = require('./routes/tumorMutationalBurden');  //tumorMutationalBurden.js 파일을 선언한다. 
const tumortype = require('./routes/tumortype');  //tumortype.js 파일을 선언한다.
const clinically = require('./routes/clinically');
const clinical = require('./routes/clinical');
const prevalent = require('./routes/prevalent');
 // 07-07
 // statecontrol
 const statecontrol = require('./routes/statecontrol');
 
// 12-20
// mentlists
const mentlists = require('./routes/mentlists.js');
 
const polymorphismRouter = require('./routes/polymorphismRouter');

//const dvbeforsortingRouter = require('./routes/dvsortingRouter');
//const dvaftersortingRouter = require('./routes/dvsortingRouter');

//2021-06-02
const excelDvRouter = require('./routes/excelDvRouter');

// MLPA Router
const mlpaRouter = require('./routes/mlpaRouter');
// 병리 동연변이 sequencing 입력
const sequencingdiagRouter = require('./routes/sequencingdiagRouter')

//나중에 확인후 삭제할것.
// const allRouter           = require('./routes/allRouter');       //allRouter.js 파일을 선언한다.
// const mdsmpnRouter        = require('./routes/mdsmpnRouter');    //mdsmpnRouter.js 파일을 선언한다.
// const lymphomaRouter      = require('./routes/lymphomaRouter');  //lymphomaRouter.js 파일을 선언한다.


// middleware
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
 

// 로그인
app.use('/loginDiag', loginDiagRouter);
app.use('/loginPath', loginPathRouter);

app.use('/fileUpload', fileuploadRouter);

// 병리 등록환자 당일 검색
app.use('/patients_path', patientListPathRouter);

app.use('/inhouseUplad', inhouseuploadRouter);
app.use('/pathfileUpload', diseaseuploadRouter);
// 병리 그림파일 올리기 2021.9.17
app.use('/pathimageUpload', pathimageUploadRouter);
// 병리 그림파일 보기
app.use('/showImage',  function(req, res) {
    const filepath = req.query.path;
    const filename = req.query.filename;
    console.log('[167][download]', filepath, filename);
    const file = `${__dirname}/${filepath}/${filename}`;
 
 
    try {
        const extend = filename.split('.');
        const type = extend[1];
        let contentType ='';
        if (type === 'jpg') {
            contentType = "image/jpeg";
        } else if (type === 'png') {
            contentType = "image/png";
        }

        res.writeHead(200, {"Content-Type": contentType });

        fs.readFile(file,  (err, content)  =>{                   
                    res.end(content);
                });

    } catch(err) {
        logger.error('[32][show Image File]err=' + error.message);
    }


});

// 2021.07.23
// 병리 연구용리스트
app.use('/patients_research', patientListResearchRouter);

app.use('/pathResearchfileUpload', diseaseResaearchuploadRouter);

app.use('/pathResearchReportInsert', pathResearchReportRouter);

// 등록
app.use('/register', registerRouter);

// 사용자 정보 가져오기
app.use('/manageUsers', manageUsersRouter); 

// 통계 정보 가져오기
app.use('/manageStatistics', manageStatisticsRouter); 

// 함수 정보 가져오기
app.use('/manageFunctions', manageFunctionsRouter); 

// 함수 상세 가져오기
app.use('/detailFunctions', detailFunctionsRouter); 

// 환자목록 가져오기
app.use('/patients', patientListRouter);
app.use('/patients_diag', patientListDiagRouter);

// 2021.02.02 진검 report_patient
app.use('/report_patient', reportPatientListRouter);
// 2021.02.02 진검 report_patient
app.use('/report_xml', reportXmlRouter);

//검사자 필터링된 리스트 가겨오기
app.use('/filteredTSV', filteredTSVListRouter);

// 유전체 와 nucleotide_change(coding) 로 mutation 있는지 알아보기
app.use('/findGeneExist', geneExistRouter);
 
// 유전체 와 nucleotide_change(coding)가 없을때 추가하기
app.use('/addGeneInfo', addGeneInfoRouter);
// 유전체 와 nucleotide_change(coding) 로 mutation 레코드에서 최신정보 1개 가져오기
app.use('/mutationInfo', mutationInfoRouter);
//유전체 와 nucleotide_change(coding) 가 2개 있는경우 두개중 1개가 있으면 mutation 레코드에서 최신정보 1개 가져오기

// 유전체 정보로 comments 정보 가져오기
app.use('/comments', commentsRouter);
app.use('/commentsCount', commentsCountRouter);
// 유전체 정보로 artifacts 정보 가져오기
app.use('/artifacts', artifactsRouter);
app.use('/artifactsCount', artifactsCountRouter);
app.use('/artifactsInsert',artifactsInsertRouter);
// 유전체 정보로 benign 정보 가져오기
app.use('/benign', benignRouter);
app.use('/benignCount', benignCountRouter);
app.use('/benignInsert',benignInsertRouter);
// Mutation
app.use('/mutationMapper', mutationRouter);

// 결과지
app.use('/ngscomments', commentsRouters);
app.use('/ngsartifacts', artifactsRouters);
app.use('/ngsbenign', benignRouters);
// Mutation
app.use('/mutation', mutationRouters);

// 유전체 정보로 comment 레코드에서 정보 가져오기
app.use('/findGeneComment', geneCommentRouter);

// 화일명과 검체번호로 저장된 경로 알아내기
app.use('/getSavedFilePath', savedFilePathRouter);


//검사자 날자별 검색
app.use('/searchpatient', searchpatientRouter);
app.use('/searchpatient_diag', searchpatientDiagRouter);
app.use('/searchpatient_path', searchpatientPathRouter);


// In-House 등록/수정/삭제
// Mutation
app.use('/mutation', mutationRouter);


app.use('/tests', function(req, res, next) {
   // console.log('Time: %d', Date.now());
    //console.log(req);
    const start = req.query.start;
    const end  = req.query.end;
	res.json({start: start, end: end});
    next();
  });
 
  // 유전자 정보 관리
  app.use('/diagGene', diagGeneRouter);
  
 // 검진 EMR 보내기
  app.use('/diagEMR', emrRouter);
  app.use('/sendToEMR', emrRouter);
 // 병리 EMR 보내기
  app.use('/pathEMR', pathologyRouter);

 // EMR 전송후 진검 갱신
 // EMR 전송후 병리 갱신
  app.use('/pathEmrUpdate', pathEmrUpdateRouter);
  app.use('/screenlists', pathEmrUpdateRouter);
  
 //screen 
 app.use('/screen', screenRouter);                //AML screen => 디렉토리 파일명
 // 12.14
 // all Sceen
 app.use('/allscreen', allScreenRouter);          //ALl screen => 디렉토리 파일명


 //2020.11.19 add
 //2020.11.21
 //진검, 병리 결과지/보고서 입력, 수정, 삭제
 app.use('/amlReportInsert', amlReportRouter);                //진검. amlReportInsert => 디렉토리 파일명
 app.use('/pathologyReportInsert', pathologyReportRouter);    //병리. pathologyReportInsert => 디렉토리 파일명

 app.use('/pathologyimage', pathologyImageRouter);    //병리. pathologyImageRouter => 디렉토리 파일명

 app.use('/amlReportSearch', amlSearchRouter);                //진검. amlSearchRouter => 디렉토리 파일명
 app.use('/pathologyReportSearch', pathologySearchRouter);    //병리. pathologySearchRouter => 디렉토리 파일명
  //  병리 코멘트
  app.use('/pathmentlist', pathMentRouter);
 
 // 12/14
 app.use('/filteredOriginData', filteredOriginData);     //병리. filteredOriginData => 디렉토리 파일명
 app.use('/msiscore', msiscore);     //병리. msiscore => 디렉토리 파일명
 app.use('/tumorcellpercentage', tumorcellpercentage);     //병리. tumorcellpercentage => 디렉토리 파일명
 app.use('/tumorMutationalBurden', tumorMutationalBurden);     //병리. tumorMutationalBurden => 디렉토리 파일명
 app.use('/tumortype', tumortype);     //병리. tumortype => 디렉토리 파일명
 app.use('/clinically',clinically);    // 병리
 app.use('/clinical', clinical); 
 app.use('/prevalent', prevalent);

 // 07-07
 // statecontrol
 app.use('/statecontrol', statecontrol);

 // 12-20
 app.use('/mentlists', mentlists);
 // detected variants sort
 //app.use('/dvbeforsorting', dvbeforsortingRouter);
 //app.use('/dvaftersorting', dvaftersortingRouter);

 // 2021-06-02
 app.use('/excelDv', excelDvRouter);
// MLPA
 app.use('/mlpa', mlpaRouter);

// 병리 돌연변이 sequencing 입력
app.use('/sequencingdiag',sequencingdiagRouter);

 // 화일 내려받기
 app.use('/download', function(req, res) {
     const filepath = req.query.path;
     const filename = req.query.filename;
     console.log('[178][download]', filepath, filename);
     const file = `${__dirname}/${filepath}/${filename}`;
     res.download(file);

 });

 

 // 제거 유전자 목록
 app.use('/polymorphism', polymorphismRouter);
 // app.use('/allInsert', allRouter);
 // app.use('/mdsmpnInsert', mdsmpnRouter);
 // app.use('/lymphomaInsert', lymphomaRouter);


	//	MDS/MPN 
	//	Lymphoma
const port = process.env.PORT || 3000;

app.listen(port, (req,res)=> {
   console.log('Running Server 3000 ....');
  });
