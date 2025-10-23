import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateTenantSummary, generateMatchExplanation as generateMatchExplanationSvc } from '../services/geminiService';

const prisma = new PrismaClient();

// FIX: Changed AuthRequest from interface to type alias to correctly inherit properties from express.Request
type AuthRequest = Request & {
  user?: { id: string };
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, username: true, profession: true, role: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
    const { username, profession } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user!.id },
            data: { username, profession },
            select: { id: true, email: true, username: true, profession: true, role: true }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

export const getMySavedListings = async (req: AuthRequest, res: Response) => {
    try {
        const userWithListings = await prisma.user.findUnique({
            where: { id: req.user!.id },
            include: { savedListings: true }
        });
        if (!userWithListings) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userWithListings.savedListings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get saved listings' });
    }
};

export const toggleSavedListing = async (req: AuthRequest, res: Response) => {
    const { listingId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            include: { savedListings: { where: { id: listingId } } }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isSaved = user.savedListings.length > 0;

        await prisma.user.update({
            where: { id: req.user!.id },
            data: {
                savedListings: isSaved
                    ? { disconnect: { id: listingId } }
                    : { connect: { id: listingId } }
            }
        });

        res.status(200).json({
            message: `Listing ${isSaved ? 'unsaved' : 'saved'} successfully.`,
            saved: !isSaved
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to toggle saved listing' });
    }
};


export const generateTenantSummaryForUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            include: { documents: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const summary = await generateTenantSummary(user, user.documents);
        res.json({ summary });
    } catch (error) {
        console.error("Error generating tenant summary:", error);
        res.status(500).json({ message: "Could not generate AI summary." });
    }
};
