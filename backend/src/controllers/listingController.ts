import { Request, Response } from 'express';
import { PrismaClient, PropertyType } from '@prisma/client';
// FIX: Import Gemini service to generate match explanation
import { generateMatchExplanation as generateMatchExplanationSvc } from '../services/geminiService';


const prisma = new PrismaClient();

export const getAllListings = async (req: Request, res: Response) => {
  const { searchTerm, propertyType, maxPrice, minBedrooms } = req.query;

  try {
    const filters: any = {};
    if (searchTerm) {
      filters.OR = [
        { title: { contains: searchTerm as string, mode: 'insensitive' } },
        { address: { contains: searchTerm as string, mode: 'insensitive' } },
      ];
    }
    if (propertyType && propertyType !== 'Any') {
      filters.type = propertyType as PropertyType;
    }
    if (maxPrice) {
      filters.price = { lte: parseInt(maxPrice as string) };
    }
    if (minBedrooms && parseInt(minBedrooms as string) > 0) {
      filters.bedrooms = { gte: parseInt(minBedrooms as string) };
    }

    const listings = await prisma.listing.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Failed to get listings:', error);
    res.status(500).json({ message: 'Failed to retrieve listings' });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve listing' });
  }
};

// FIX: Add new controller function to handle match explanation generation
export const explainMatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userPreferences } = req.body;

    if (!userPreferences) {
        return res.status(400).json({ message: 'userPreferences is required' });
    }

    try {
        const listing = await prisma.listing.findUnique({ where: { id } });
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        
        const explanation = await generateMatchExplanationSvc(listing.title, userPreferences as string);
        res.status(200).json({ explanation });
    } catch (error) {
        console.error("Error generating match explanation:", error);
        res.status(500).json({ message: 'Failed to generate match explanation' });
    }
};
