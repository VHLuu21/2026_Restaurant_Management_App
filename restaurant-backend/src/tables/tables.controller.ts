import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';
import { TableStatus } from './table.entity';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Get('public/available')
    findPublicAvailable(@Query('guestCount') guestCount?: string) {
        const parsedGuestCount = guestCount ? Number(guestCount) : undefined;
        return this.tablesService.findAvailableTables(parsedGuestCount);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateTableDto) {
        return this.tablesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.tablesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tablesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTableDto,
    ) {
        return this.tablesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    setStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: TableStatus,
    ) {
        return this.tablesService.setStatus(id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tablesService.remove(id);
    }
}