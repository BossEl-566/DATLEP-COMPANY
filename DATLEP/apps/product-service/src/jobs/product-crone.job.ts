import { Product } from '@datlep/database';
import cron from 'node-cron';


cron.schedule('0 * * * *', async () => {
    console.log('Deleting inactive products...');
    try {
        const now = new Date();
        //Delete products that have been inactive for 24 hours
        const inactiveProducts = await Product.find({ status: 'inactive', deletedAt: { $lt: now } });

        for (const product of inactiveProducts) {
            await Product.deleteOne({ _id: product._id });
        }
        console.log(`Deleted ${inactiveProducts.length} inactive products`);
        
    } catch (error) {
       console.error('Error deleting inactive products:', error); 
    }
});