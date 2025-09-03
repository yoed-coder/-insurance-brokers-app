const express = require('express');
const router = express.Router();

const installRouter = require('./install.routes');
const employeeRouter = require('./employee.routes');
const loginRouter = require('./login.routes');
const claimRouter = require('./claim.routes');
const insuredRouter = require('./insured.routes');      // insured table
const customerRouter = require('./customer.routes');    // customer table
const insurerRouter = require('./insurer.routes');
const policyRouter = require('./policy.routes');
const reportRouter = require('./report.routes');
const commissionRouter = require('./commission.routes');
const vehicleRouter = require('./vehicle.routes');
const contactRoutes = require('./contact.routes');
const aiRoutes = require('./ai.routes'); 
const partnerRouter = require('./partner.routes')
const auditRoutes = require('./audit.routes'); 

// Use routers with proper paths
router.use('/api', insuredRouter);
router.use('/api', customerRouter);
router.use('/api', contactRoutes);
router.use('/api', installRouter);
router.use('/api', employeeRouter);
router.use('/api', loginRouter);
router.use('/api', claimRouter);
router.use('/api', insurerRouter);
router.use('/api', policyRouter);
router.use('/api', reportRouter);
router.use('/api', commissionRouter);
router.use('/api', vehicleRouter);
router.use('/api', aiRoutes);
router.use('/api', partnerRouter)
router.use('/api', auditRoutes)
module.exports = router;
