# grosirin_be
Grosirin Backend


commit ed7be73808937e4ae0215ecc9d48f6adc1bdf8e7
- BIG UPDATE, NEW FLOW CART, TRANSACTION, THERE ARE STILL LOTS OF BUGS


router.post("/management", tokenMiddleware.verifyToken, (req, res, next) => {
    const uploadImages = upload.uploadImage('management-logos/management-logos');
    uploadImages.single('logo')(req, res, next);
}, ManagementController.postManagement);

router.put("/business-account/:id", upload.fields([{ name: 'watermark_logo' }, { name: 'struk_logo' }, { name: 'text_logo' }]), BusinessAccountController.updateBusinessAccount);


use :
    const uploadImages = upload.uploadImage('management-logos/management-logos');
    uploadImages.single('logo')(req, res, next);

or 

router.post("/property", tokenMiddleware.verifyToken, 
  upload.uploadMultipleImageFields([
    { name: 'thumbnail', prefix: 'property-thumbnails' },
    { name: 'icon', prefix: 'property-icons' }
  ]),
  PropertyController.postProperty
);