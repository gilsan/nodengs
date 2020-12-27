
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs    = require('fs');

const app = express();
// 로그인
const loginDiagRouter         = require('./routes/loginDiag');
const loginPathRouter         = require('./routes/loginPath');

const registerRouter      = require('./routes/register');

const fileuploadRouter    = require('./routes/fileupload');
const inhouseuploadRouter = require('./routes/inhouseupload');
const diseaseuploadRouter = require('./routes/diseaseupload');

// 병리 리스트
const patientListPathRouter = require('./routes/patientlist_path');


// 진검
const patientListRouter     = require('./routes/patientlist');
const patientListDiagRouter     = require('./routes/patientlist_diag');
const filteredTSVListRouter = require('./routes/filteredTSVlist');

const mutationInfoRouter        = require('./routes/mutationInfoList');
const geneExistRouter       = require('./routes/geneExist');
const addGeneInfoRouter     = require('./routes/addGeneToMutation');

const commentsRouter        = require('./routes/commentsRouter');
const artifactsRouter       = require('./routes/artifactsRouter');
const benignRouter          = require('./routes/benignRouter');
const commentsCountRouter   = require('./routes/commentsCountRouter');
const artifactsCountRouter  = require('./routes/artifactsCountRouter');
const benignCountRouter     = require('./routes/benignCountRouter');
const artifactsInsertRouter = require('./routes/artifactsInsertRouter');
const benignInsertRouter    = require('./routes/benignInsertRouter');

const geneCommentRouter     = require('./routes/geneCommentRouter');
const savedFilePathRouter   = require('./routes/savedFilePathRouter');
// Mutation 등록
const mutationRouter        = require('./routes/mutationRouter');

const searchpatientRouter   = require('./routes/searchRouter');
const searchpatientDiagRouter   = require('./routes/searchRouter_diag');
const searchpatientPathRouter   = require('./routes/searchRouter_path');
// EMR로 보내기
const emrRouter                 = require('./routes/emrroute');
const pathologyRouter           = require('./routes/pathologyRoute');
const { start } = require('repl');

// middleware
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
 
app.use('/fileUpload', fileuploadRouter);
app.use('/inhouseUplad', inhouseuploadRouter);
 //app.use('/diseaseUpload', diseaseuploadRouter);

// 로그인
app.use('/loginDiag', loginDiagRouter);
app.use('/loginPath', loginPathRouter);
// 등록
app.use('/register', registerRouter);


// 환자목록 가져오기
app.use('/patients', patientListRouter);
app.use('/patients_diag', patientListDiagRouter);
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

// 유전체 정보로 comment 레코드에서 정보 가져오기
app.use('/findGeneComment', geneCommentRouter);

// 화일명과 검체번호로 저장된 경로 알아내기
app.use('/getSavedFilePath', savedFilePathRouter);


//검사자 날자별 검색
app.use('/searchpatient', searchpatientRouter);
app.use('/searchpatient_diag', searchpatientDiagRouter);
app.use('/searchpatient_path', searchpatientPathRouter);

// 병리 등록환자 당일 검색
app.use('/patients_path', patientListPathRouter);


// In-House 등록/수정/삭제
// Mutation
app.use('/mutation', mutationRouter);


app.use('/tests', function(req, res, next) {
   // console.log('Time: %d', Date.now());
    // console.log(req);
    const start = req.query.start;
    const end  = req.query.end;
	res.json({start: start, end: end});
    next();
  });
 
 // 검진 EMR 보내기
  app.use('/diagEMR', emrRouter);
  app.use('/sendToEMR', emrRouter);
// 병리 EMR 보내기
  app.use('/pathEMR', pathologyRouter);

const port = process.env.PORT || 3000;

app.listen(port, (req,res)=> {
   console.log('Running Server 3000 ....');
  });
