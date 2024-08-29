import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    

    try {
        const { email, name, password, role } = await req.json();

        //validation
        if(!email || !name || !password || !role) {
            return NextResponse.json(
                { code:400, message: "Missing required fields"},
                { status: 400 }
            );
        }
        console.log('Received data:', email, name, password, role);

        const checkUserExists = await prisma.user.findUnique({where: {email}});

        if(checkUserExists){
            return NextResponse.json(
                {code:400, message: "User already exists"},
                {status: 400}
            )
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                username: name,
                password: hashedPassword,
                user_type: role
            }
        })
        console.log("User created successfully:", newUser);

        return NextResponse.json({
            code: 200,
            message: "User created successfully",
            user: newUser
        })

    } catch (error:any) {
        console.error("Error creating user:", error.message);
        return NextResponse.json(
            {code: 500, message: "Internal server error"},
            {status: 500}
        )
    }
}

