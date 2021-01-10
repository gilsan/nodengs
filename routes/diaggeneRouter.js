
/**
 * 진검 유전자 관리 라으터
 */

const express = require('express');
const router = express.Router();

// diaggene => 유전자 내용을 저장하는 소스
const  diagGeneController = require('../controller/diaggene');
      
//병리 유전체 정보 보고서 입력
//clinically 소스내의   함수
router.post('/list', diagGeneController.listDiagGene);
router.post('/insert', diagGeneController.insertDiagGene);
router.post('/update', diagGeneController.updateDiagGene);
router.post('/delete', diagGeneController.deleteDiagGene);
router.get('/listall', diagGeneController.listAllDiagGene);

module.exports = router;