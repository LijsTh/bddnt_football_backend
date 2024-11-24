import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    return this.prisma.teams.create({
      data: {
        name: createTeamDto.name,
        photo: createTeamDto.photo
          ? { create: createTeamDto.photo }
          : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.teams.findMany({
      include: {
        photo: true, // Incluye la foto del equipo si existe
        users: true, // Incluye los usuarios asociados
        players: true, // Incluye los jugadores asociados
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.teams.findUnique({
      where: { id },
      include: {
        photo: true, // Incluye la foto del equipo si existe
        users: true, // Incluye los usuarios asociados
        players: true, // Incluye los jugadores asociados
      },
    });
  }

  async findPlayersByTeamId(teamId: string) {
    return this.prisma.teams.findUnique({
      where: { id: teamId },
      include: {
        players: true, // Incluye los jugadores asociados
        users: true, // Incluye los usuarios asociados
      },
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.prisma.teams.update({
      where: { id },
      data: {
        name: updateTeamDto.name,
        photo: updateTeamDto.photo
          ? {
              upsert: {
                create: updateTeamDto.photo,
                update: updateTeamDto.photo,
              },
            }
          : undefined,
        users: updateTeamDto.users
          ? {
              set: updateTeamDto.users.map((userId) => ({ id: userId })),
            }
          : undefined,
        players: updateTeamDto.players
          ? {
              set: updateTeamDto.players.map((playerId) => ({ id: playerId })),
            }
          : undefined,
      },
      include: {
        photo: true,
        users: true,
        players: true,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.teams.delete({
      where: { id },
      include: {
        photo: true,
        users: true,
        players: true,
      },
    });
  }
}