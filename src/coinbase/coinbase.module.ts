import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { UsersModule } from 'src/users/users.module';
import { CoinbaseAuthService } from './coinbase-auth.service';
import { CoinbaseController } from './coinbase.controller';
import { CoinbaseService } from './coinbase.service';

@Module({
  imports: [HttpModule, EncryptionModule, ConfigModule, UsersModule],
  controllers: [CoinbaseController],
  providers: [CoinbaseAuthService, CoinbaseService],
})
export class CoinbaseModule {}
