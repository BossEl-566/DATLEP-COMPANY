import { SiteConfigModel } from "@datlep/database";
import { Request, Response, NextFunction } from "express";


export const getCategory = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await SiteConfigModel.findOne();  
      if(!config){
        return res.status(404).json({ message: "SiteConfig not found" });
      }
      return res.status(200).json(config);
    } catch (error) {
        return next(error);
    }
} 